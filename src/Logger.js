class Logger {
    discord(message) {
        return console.log(`[${this.getCurrentTime()}] Discord > ${message}`)
    }

    express(message) {
        return console.log(`[${this.getCurrentTime()}] Express > ${message}`)
    }

    error(message) {
        return console.log(`[${this.getCurrentTime()}] Error > ${message}`)
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }
}

module.exports = Logger
