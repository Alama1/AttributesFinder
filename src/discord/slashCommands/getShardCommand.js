const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')

class createButtonCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'getshard'
    }

    async onCommand(interaction) {
        const shardName = interaction.options._hoistedOptions[0].value
        const shards = this.discord.attributeShardsAuctions[shardName].sort((a, b) => a.starting_bid - b.starting_bid)
        let replyEmbed = new EmbedBuilder()
            .setTitle(shardName)
            .setAuthor({ name: `Attribute shard ${0}/${shards.length}`, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ac/Prismarine_Shard_JE2_BE2.png/revision/latest?cb=20190430045708'})
        replyEmbed
            .setDescription('Shard found!')

        const nextItemButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nextitemshard')
                    .setLabel('Next item')
                    .setStyle('Primary'),
            )

        const prevItemButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previtemshard')
                    .setLabel('Previous item')
                    .setStyle('Primary'),
            )

        const clickFilter = (btnInt) => {
            return interaction.user.id === btnInt.user.id
        }

        const collector = interaction.channel.createMessageComponentCollector({
            clickFilter,
            time: 1000 * 60
        })

        let index = 0

        collector.on('collect', (clickedButton) => {
            clickedButton.deferUpdate()
            let replyEmbed = new EmbedBuilder()
                .setTitle(shardName)
                .setAuthor({ name: `Attribute shard ${index + 1}/${shards.length}`, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ac/Prismarine_Shard_JE2_BE2.png/revision/latest?cb=20190430045708'})
                .setDescription('Shard found!')
                .addFields([{name: `Price: ${shards[index].starting_bid}`, value: `/viewauction ${shards[index].uuid} \nBIN: ${shards[0].bin}`}])

            if (clickedButton.customId === "nextitemshard") {
                index++;
            } else {
                index--;
            }
            console.log(index)
            if (index < 0) {
                console.log('a')
                index = shards.length - 1
            }
            if (index >= shards.length) {
                index = 0
                console.log('b')
            }

            interaction.editReply({
                embeds: [replyEmbed]
            })
        })

        collector.on('end', () => {
            interaction.editReply({
                components: []
            })
        })

        replyEmbed
            .addFields([{name: `Price: ${shards[0].starting_bid}`, value: `/viewauction ${shards[0].uuid} \nBIN: ${shards[0].bin}`}])

        interaction.editReply({ embeds: [replyEmbed], components: [nextItemButton, prevItemButton] })
    }

}


module.exports = createButtonCommand
