const { SlashCommandBuilder } = require('@discordjs/builders');

class getShardCommand {
    constructor(interactionHandler) {
        this.interactionHandler = interactionHandler
    }

    data = new SlashCommandBuilder()
        .setName('getshard')
        .setDescription('Get lowest prices and autions of some shard')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Shard name to search for')
                .setRequired(true)
                .setAutocomplete(true))



}

module.exports = getShardCommand
