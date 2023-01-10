
class AutocompleteHandler {
    constructor(discord) {
        this.discord = discord
        this.allAttr = [
            'arachno',
            'arachno_resistance',
            'attack_speed',
            'blazing',
            'blazing_fortune',
            'blazing_resistance',
            'breeze',
            'combo',
            'deadeye',
            'dominance',
            'double_hook',
            'elite',
            'ender',
            'ender_resistance',
            'experience',
            'fisherman',
            'fishing_experience',
            'fishing_speed',
            'fortitude',
            'hunter',
            'ignition',
            'infection',
            'life_recovery',
            'life_regeneration',
            'lifeline',
            'magic_find',
            'mana_pool',
            'mana_regeneration',
            'mana_steal',
            'mending',
            'midas_touch',
            'speed',
            'trophy_hunter',
            'undead',
            'undead_resistance',
            'veteran',
            'warrior'
        ];
    }

    async onInteraction(interaction) {
        switch (interaction.commandName) {
            case 'getshard':
                this.shardAutofill(interaction)
                break
            case 'getequipment':
                this.armorAutofill(interaction)
                break
        }
    }

    shardAutofill(interaction) {
        const shards = Object.keys(this.discord.attributeShardsAuctions)
        const focusedValue = interaction.options.getFocused();
        const choices = shards.filter(shard => shard.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 10)
        interaction.respond(
            choices.map(choice => ({ name: choice, value: choice })),
        )
    }

    armorAutofill(interaction) {
        let optionName
        interaction.options._hoistedOptions.forEach((option, index) => {
            if (option.focused) optionName = interaction.options._hoistedOptions[index].name
        })

        if (optionName === 'name') {
            const shards = Object.keys(this.discord.attributeArmorAuctions)
            const focusedValue = interaction.options.getFocused();
            const choices = shards.filter(shard => shard.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 10)
            interaction.respond(
                choices.map(choice => ({ name: choice, value: choice })),
            )
        }
        else if (optionName === 'shard1') {
            const focusedValue = interaction.options.getFocused();
            const choices = this.allAttr.filter(shard => shard.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 10)
            interaction.respond(
                choices.map(choice => ({ name: choice, value: choice })),
            )
        }
        //shard2 bc any will be added
        else {
            const focusedValue = interaction.options.getFocused();
            const choices = this.allAttr.filter(shard => shard.toLowerCase().startsWith(focusedValue.toLowerCase())).slice(0, 9)
            choices.push('any')
            interaction.respond(
                choices.map(choice => ({ name: choice, value: choice })),
            )
        }

    }
}
module.exports = AutocompleteHandler
