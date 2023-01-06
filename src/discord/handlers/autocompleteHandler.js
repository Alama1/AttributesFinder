
class AutocompleteHandler {
    constructor(discord) {
        this.discord = discord
    }

    async onInteraction(interaction) {
        const typed = interaction.options._hoistedOptions[0].value
        const shards = Object.keys(this.discord.attributeAuctions)
        const focusedValue = interaction.options.getFocused();
        const choices = shards.filter(shard => shard.startsWith(typed)).slice(0, 10)
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        )
    }
}
module.exports = AutocompleteHandler
