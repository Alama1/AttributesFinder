const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')

class getShardCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'getshard'
        this.pages = {}
    }

    async onCommand(interaction) {
        const shardName = interaction.options._hoistedOptions[0].value
        const shards = this.discord.attributeShardsAuctions[shardName].sort((a, b) => a.starting_bid - b.starting_bid)

        let embeds = []

        shards.forEach((shard, index) => {
            let armorEmbed = new EmbedBuilder()
                .setTitle(shardName)
                .setAuthor({ name: `Shard ${index + 1}/${shards.length}`, iconURL:  'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ac/Prismarine_Shard_JE2_BE2.png/revision/latest?cb=20190430045708'})
                .setDescription('Shard found!')
                .addFields([{name: `Price: ${shard.starting_bid}`, value: `/viewauction ${shard.uuid} \nBIN: ${shard.bin}`}])

            embeds.push(armorEmbed)
        })


        const id = interaction.user.id
        this.pages[id] = this.pages[id] || 0
        const embed = embeds[this.pages[id]]
        let reply
        let collector

        const filter = (i) => i.user.id === interaction.user.id
        const time = 1000 * 60 * 5

        reply = await interaction.editReply({
            embeds: [embed],
            components: [this.getRow(id, embeds.length)]
        })

        collector = reply.createMessageComponentCollector({ filter, time })

        collector.on('collect', (btnInt) => {
            if (!btnInt) return
            btnInt.deferUpdate()
            if (btnInt.customId !== 'previous_embed' && btnInt.customId !== 'next_embed') return
            if (btnInt.customId === 'previous_embed' && this.pages[id] > 0) --this.pages[id]
            else if (btnInt.customId === 'next_embed' && this.pages[id] < embeds.length -1) ++this.pages[id]

            if (reply) {
                reply.edit({
                    embeds: [embeds[this.pages[id]]],
                    components: [this.getRow(id, embeds.length)]
                })
            } else {
                interaction.editReply({
                    embeds: [embeds[this.pages[id]]],
                    components: [this.getRow(id, embeds.length)]
                })
            }


        })
    }
    getRow(id, embedsLength) {
        const row = new ActionRowBuilder()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('previous_embed')
                .setLabel('Previous')
                .setStyle('Primary')
                .setDisabled(this.pages[id] === 0))
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('next_embed')
                    .setLabel('Next')
                    .setStyle('Primary')
                    .setDisabled(this.pages[id] === embedsLength -1)
            );
        return row
    }

}


module.exports = getShardCommand
