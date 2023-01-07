const { SlashCommandBuilder } = require('@discordjs/builders');

class helpCommand {
    constructor(interactionHandler) {
        this.interactionHandler = interactionHandler
    }

    data = new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get description of all commands')
}

module.exports = helpCommand
