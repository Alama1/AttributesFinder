const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')

class helpCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'help'
        this.description = 'Ye'
    }

    async onCommand(interaction) {
        const commands = this.discord.inderactionHandler.slashCommands.map(command =>{
            return `${command.name}: ${command.description}`
        })

        const resEmbed = new EmbedBuilder()
            .setTitle('Help')
            .setAuthor({ name: 'Attributes finder' })
            .addFields( [{ name: 'Disord commands', value: commands.join('\n') }])

        interaction.editReply({
            embeds: [resEmbed]
        })
    }

}


module.exports = helpCommand
