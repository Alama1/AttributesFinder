const fs = require('fs')
require('dotenv').config()

class Configuration {
    properties = {
        discord: {
            token: process.env.TOKEN,
            guildID: '717496189096034335',
            commandRole: '720396419122331708',
            ownerId: '296256874976903168',
            prefix: '!',
            messageMode: 'bot'
        },
        express: {
            enabled: false,
            port: process.env.PORT,
            authorization: "authorizationHeaderString"
        },
        minecraft: {
            ahUpdateTime: 120000,
        }
    }

    environmentOverrides = {
        DISCORD_TOKEN: val => (this.properties.discord.token = val),
        DISCORD_CHANNEL: val => (this.properties.discord.channel = val),
        DISCORD_COMMAND_ROLE: val => (this.properties.discord.commandRole = val),
        DISCORD_OWNER_ID: val => (this.properties.discord.ownerId = val),
        DISCORD_PREFIX: val => (this.properties.discord.prefix = val),
        MESSAGE_MODE: val => (this.properties.discord.messageMode = val),
        EXPRESS_ENABLED: val => (this.properties.express.enabled = val),
        EXPRESS_PORT: val => (this.properties.express.enabled = val),
        EXPRESS_AUTHORIZATION: val => (this.properties.express.authorization = val)
    }

    constructor() {

    }

    get discord() {
        return this.properties.discord
    }

    get express() {
        return this.properties.express
    }
}

module.exports = Configuration
