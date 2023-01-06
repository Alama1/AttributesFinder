const Discord = require('discord.js')
const StateHandler = require('./handlers/stateHandler')
const AuctionHandler = require('./handlers/auctionHandler')
const InteractionHandler = require('./handlers/interactionHandler')
const AutocompleteHandler = require('./handlers/autocompleteHandler')
const {IntentsBitField} = require("discord.js");

class DiscordManager {
    constructor(app) {
        this.app = app
        this.stateHandler = new StateHandler(this)
        this.auctionhandler = new AuctionHandler(this)
        this.attributeAuctions = {}
    }

    connect() {
        const allIntends = new IntentsBitField(9763)
        this.client = new Discord.Client({
            cacheGuilds: true,
            cacheChannels: true,
            cacheOverwrites: false,
            cacheRoles: true,
            cacheEmojis: false,
            cachePresences: false,
            intents: allIntends
        })
        setInterval(() => {
            this.auctionhandler.attributesGrabber()
        }, this.app.config.properties.minecraft.ahUpdateTime)


        this.auctionhandler.attributesGrabber()

        this.client.on('ready', () => {
            this.stateHandler.onReady()
            this.inderactionHandler = new InteractionHandler(this)
            this.autocompleteHandler = new AutocompleteHandler(this)
        })

        this.client.on('interactionCreate', (interaction) => {
            if (!interaction.isAutocomplete()) {
                this.inderactionHandler.onInteraction(interaction)
                return
            }
            this.autocompleteHandler.onInteraction(interaction)

        })

        this.client.on('interactionCreate', (interaction) => {

        })

        this.client.login(this.app.config.properties.discord.token)
            .catch(error => {
                this.app.log.error(error)

                process.exit(1)
            })

    }
}

module.exports = DiscordManager
