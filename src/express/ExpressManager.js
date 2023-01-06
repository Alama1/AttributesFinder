const express = require('express')
const fs = require('fs')


class ExpressManager {
    constructor(app) {
        this.app = app
        this.express = express()
        this.router = express.Router()
    }

    initialize() {
        if (!this.app.config.express.enabled) {
            return this.app.log.express('Express disabled in configuration, skipping initialization.')
        }

        this.router.get('/keepAlive', this.keepAlive.bind(this))

        this.express.use(express.json(), express.urlencoded({ extended: false }), this.authenticate.bind(this), this.validateBody.bind(this))
        this.express.use('/api', this.router)
        this.express.set('json spaces', 2)

        this.express.listen(this.app.config.express.port, () => {
            this.app.log.express(`API online and is running on http://localhost:${this.app.config.express.port}/api/`)
        })
    }

    keepAlive(request, response) {
        return response.status(200).json({
            success: true,
            response: 'Still alive'
        })
    }

    authenticate(request, response, next) {
        try {
            next()
        } catch (error) {
            this.app.log.error(error)

            return response.status(500).json({
                success: false,
                reason: 'An internal server error occurred'
            })
        }
    }

    validateBody(request, response, next) {
        try {
            const path = request.path.slice(5)

            switch (path) {
                case 'keepAlive':
                    next()
                    break

                default:
                    if (this.missing(['username'], request.body)) {
                        return response.status(400).json({
                            success: false,
                            reason: 'Malformed Body'
                        })
                    }
                    next()
            }
        } catch (error) {
            this.app.log.error(error)

            return response.status(500).json({
                success: false,
                reason: 'An internal server error occurred'
            })
        }
    }

    missing(array, object) {
        try {
            let missing = false

            array.forEach(element => {
                if (!object[element]) missing = true
            })

            return missing
        } catch (error) {
            return true
        }
    }

}

module.exports = ExpressManager
