const {EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

class getArmorCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'getarmor'
        this.description = 'Get armor or equipment with specific attributes'
        this.pages = {}

    }

    async onCommand(interaction) {
        const armorName = interaction.options._hoistedOptions[0].value
        const shard1 = interaction.options._hoistedOptions[1].value
        const shard1level = interaction.options._hoistedOptions[2].value
        const shard2 = interaction.options._hoistedOptions[3].value
        const shard2level = interaction.options._hoistedOptions[4].value
        let armorWithShards = this.discord.attributeArmorAuctions[armorName].filter(function (piece) {
            //two shards request
            if (shard2 !== 'any') {
                if (!piece.item_stats.hasOwnProperty(shard1) || !piece.item_stats.hasOwnProperty(shard2)) return false
                //two shards with specific levels
                if (shard1level !== 'any' && shard2level !== 'any') {
                    return piece.item_stats[shard1] >= +shard1level && piece.item_stats[shard2] >= +shard2level
                }
                //only first shard with specific level
                if (shard1level !== 'any') {
                    return piece.item_stats[shard1] >= +shard1level
                }
                //only second shard with specific level
                if (shard2level !== 'any') {
                    return piece.item_stats.hasOwnProperty(shard1) && piece.item_stats[shard2] >= +shard2level
                }
                return piece.item_stats.hasOwnProperty(shard1) && piece.item_stats.hasOwnProperty(shard2)
            }
            //Only one shard requested
            if (shard1level !== 'any') {
                return piece.item_stats[shard1] >= +shard1level
            }
            return piece.item_stats.hasOwnProperty(shard1)
        })

        if (armorWithShards.length === 0) {
            let notFoundEmbed = new EmbedBuilder()
                .setTitle('Armor not found')
                .setAuthor({ name: armorName, iconURL: 'https://i.imgflip.com/4/65939r.jpg'})
                .setDescription(`Your ${armorName} with shards:\n*${shard1}*\n*${shard2}*\nNot found :(`)
            interaction.editReply({ embeds: [notFoundEmbed] })
            return
        }

        armorWithShards = armorWithShards.sort((a, b) => a.starting_bid - b.starting_bid)

        let embeds = []

        armorWithShards.forEach((armor, index) => {
            let armorEmbed = new EmbedBuilder()
                .setTitle(armorName)
                .setAuthor({ name: `Equipment ${index + 1}/${armorWithShards.length}`, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/InvSprite.png/revision/latest?cb=20221123185755&format=original&format=original'})
                .setDescription(`Armor/equipment found!\n${Object.entries(armor.item_stats).join('\n')}`)
                .addFields([{name: `Price: ${armor.starting_bid}`, value: `/viewauction ${armor.uuid} \nBIN: ${armor.bin}`}])

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


module.exports = getArmorCommand
