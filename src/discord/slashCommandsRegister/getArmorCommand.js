const {SlashCommandBuilder} = require('@discordjs/builders');

class getShardCommand {
    constructor(interactionHandler) {
        this.interactionHandler = interactionHandler
    }

    shardLevels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'any']

    data = new SlashCommandBuilder()
        .setName('getarmor')
        .setDescription('Get lowest prices and autions of some armor/equipment with special attributes')
        .addStringOption(option =>
            option.setName('name')
                .setRequired(true)
                .setDescription('Phrase to search for')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('shard1')
                .setRequired(true)
                .setDescription('First shard that you want')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('shard1level')
                .setRequired(true)
                .setDescription('First shard level')
                //discord doesn't want to take array for some reason
                .addChoices(
                    {name: '1', value: '1'},
                    {name: '2', value: '2'},
                    {name: '3', value: '3'},
                    {name: '4', value: '4'},
                    {name: '5', value: '5'},
                    {name: '6', value: '6'},
                    {name: '7', value: '7'},
                    {name: '8', value: '8'},
                    {name: '9', value: '9'},
                    {name: '10', value: '10'},
                    {name: 'any', value: 'any'}))
        .addStringOption(option =>
            option.setName('shard2')
                .setRequired(true)
                .setDescription('Second shard that you want OR ANY')
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('shard2level')
                .setRequired(true)
                .setDescription('Second shard level')
                .addChoices(
                    {name: '1', value: '1'},
                    {name: '2', value: '2'},
                    {name: '3', value: '3'},
                    {name: '4', value: '4'},
                    {name: '5', value: '5'},
                    {name: '6', value: '6'},
                    {name: '7', value: '7'},
                    {name: '8', value: '8'},
                    {name: '9', value: '9'},
                    {name: '10', value: '10'},
                    {name: 'any', value: 'any'}))
}

module.exports = getShardCommand
