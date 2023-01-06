class StateHandler {
    constructor(discord) {
        this.discord = discord
    }

    async onReady() {
        this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
        this.discord.client.user.setActivity('Auction', { type: 'WATCHING' })
    }

}

module.exports = StateHandler
