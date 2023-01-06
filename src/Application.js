const Configuration = require('./Config')
const DiscordManager = require('./discord/DiscordManager')
const ExpressManager = require('./express/ExpressManager')
const Logger = require('./Logger')

class Application {
    async register() {
        this.config = new Configuration()
        this.log = new Logger()

        this.discord = new DiscordManager(this)
        this.express = new ExpressManager(this)

    }

    async connect() {
        this.discord.connect()
        this.express.initialize()
    }
}

module.exports = new Application()
