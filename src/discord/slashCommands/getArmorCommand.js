const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require('discord.js')

class getArmorCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'getarmor'
    }

    async onCommand(interaction) {
        const armorName = interaction.options._hoistedOptions[0].value
        const shard1 = interaction.options._hoistedOptions[1].value
        const shard1level = interaction.options._hoistedOptions[2].value
        const shard2 = interaction.options._hoistedOptions[3].value
        const shard2level = interaction.options._hoistedOptions[4].value
        let armorWithOneShard = this.discord.attributeArmorAuctions[armorName].filter(function (piece) {
            //two shards request
            if (shard2 !== 'any') {
                console.log(piece.item_stats)
                if (!piece.item_stats.hasOwnProperty(shard1) || !piece.item_stats.hasOwnProperty(shard2)) return false
                //two shards with specific levels
                console.log(shard1level)
                console.log(shard2level)
                if (shard1level !== 'any' && shard2level !== 'any') {
                    console.log('Two shards with two levels')
                    return piece.item_stats[shard1] === +shard1level && piece.item_stats[shard2] === +shard2level
                }
                //only first shard with specific level
                if (shard1level !== 'any') {
                    console.log('Only first has level')
                    console.log(piece.item_stats[shard1])
                    console.log(piece.item_stats[shard1] === +shard1level)
                    return piece.item_stats[shard1] === +shard1level
                }
                //only second shard with specific level
                if (shard2level !== 'any') {
                    console.log('Only second has level')
                    return piece.item_stats.hasOwnProperty(shard1) && piece.item_stats[shard2] === +shard2level
                }
                return piece.item_stats.hasOwnProperty(shard1) && piece.item_stats.hasOwnProperty(shard2)
            }
            //Only one shard requested
            if (shard1level !== 'any') {
                return piece.item_stats[shard1] === +shard1level
            }
            return piece.item_stats.hasOwnProperty(shard1)
        })

        if (armorWithOneShard.length === 0) {
            let notFoundEmbed = new EmbedBuilder()
                .setTitle('Armor not found')
                .setAuthor({ name: armorName, iconURL: 'https://i.imgflip.com/4/65939r.jpg'})
                .setDescription(`Your ${armorName} with shards:\n*${shard1}*\n*${shard2}*\nNot found :(`)
            interaction.editReply({ embeds: [notFoundEmbed] })
            return
        }

        armorWithOneShard = armorWithOneShard.sort((a, b) => a.starting_bid - b.starting_bid)

        let replyEmbed = new EmbedBuilder()
            .setTitle(armorName)
            .setAuthor({ name: `Attribute shard ${1}/${armorWithOneShard.length}`, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/InvSprite.png/revision/latest?cb=20221123185755&format=original&format=original'})
        replyEmbed
            .setDescription(`Armor/equipment found!\n${Object.entries(armorWithOneShard[0].item_stats).join('\n')}`)

        const nextItemButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('nextitemarmor')
                    .setLabel('Next')
                    .setStyle('Primary'),
            )

        const prevItemButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previtemarmor')
                    .setLabel('Previous')
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
                .setTitle(armorWithOneShard)
                .setAuthor({ name: `Attribute shard ${index + 1}/${armorWithOneShard.length}`, iconURL: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ac/Prismarine_Shard_JE2_BE2.png/revision/latest?cb=20190430045708'})
                .setDescription('Shard found!')
                .addFields([{name: `Price: ${armorWithOneShard[index].starting_bid}`, value: `/viewauction ${armorWithOneShard[index].uuid} \nBIN: ${armorWithOneShard[0].bin}`}])

            if (clickedButton.customId === "nextitemarmor") {
                index++;
            } else {
                index--;
            }
            if (index < 0) {
                index = shards.length - 1
            }
            if (index >= shards.length) {
                index = 0
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
            .addFields([{name: `Price: ${armorWithOneShard[0].starting_bid}`, value: `/viewauction ${armorWithOneShard[0].uuid} \nBIN: ${armorWithOneShard[0].bin}`}])

        interaction.editReply({ embeds: [replyEmbed], components: [nextItemButton, prevItemButton] })
    }

}


module.exports = getArmorCommand
