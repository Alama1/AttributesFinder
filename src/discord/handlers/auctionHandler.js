const it = require("node:test");

class AuctionHandler {
    constructor(discord) {
        this.listOfEqupment = [
            'Sword of Bad Health', 'Blade of the Volcano', 'Ragnarock axe', 'Enrager', 'Fire Freeze Staff', 'Fire Fury Staff', 'Sulphur Bow', 'Staff of the Volcano', 'Fire Veil Wand', 'Hellstorm Wand', 'Wand of Strength', 'Taurus Helmet', 'Flaming Chestplate', 'Moogma Leggings', 'Slug Boots', 'Rampart Helmet', 'Rampart Chestplate', 'Rampart Leggings', 'Rampart Boots', 'Shimmering Light Hood', 'Shimmering Light Tunic', 'Shimmering Light Trousers', 'Shimmering Light Slippers', 'Berserker Helmet', 'Berserker Chestplate', 'Berserker Leggings', 'Berserker Boots', 'Rekindled Ember Helmet', 'Rekindled Ember Chestplate', 'Rekindled Ember Leggings', 'Rekindled Ember Boots', 'Thunder Helmet', 'Thunder Chestplate', 'Thunder Leggings', 'Thunder Boots', 'Aurora Helmet', 'Aurora Chestplate', 'Aurora Leggings', 'Aurora Boots', 'Crimson Helmet', 'Crimson Chestplate', 'Crimson Leggings', 'Crimson Boots', 'Terror Helmet', 'Terror Chestplate', 'Terror Leggings', 'Terror Boots', 'Fervor Helmet', 'Fervor Chestplate', 'Fervor Leggings', 'Fervor Boots', 'Hollow Helmet', 'Hollow Chestplate', 'Hollow Leggings', 'Hollow Boots', 'Magma Lord Helmet', 'Magma Lord Chestplate', 'Magma Lord Leggings', 'Magma Lord Boots', 'Magma Necklace', 'Delirium Necklace', 'Lava Shell Necklace', 'Molten Necklace', 'Vanquished Magma Necklace', 'Blaze Belt', 'Scoville Belt', 'Implosion Belt', 'Molten Belt', 'Vanquished Blaze Belt', 'Glowstone Gauntlet', 'Flaming Fist', 'Gauntlet of Contagion', 'Vanquished Glowstone Gauntlet', 'Ghast Cloak', 'Molten Cloak', 'Scourge Cloak', 'Vanquished Ghast Cloak', 'Molten Bracelet', 'Magma Rod', 'Inferno Rod', 'Hellfire Rod'
        ]
        this.discord = discord
        this.baseURL = `https://api.hypixel.net/skyblock`
    }
    async attributesGrabber() {
        let auctions = []
        let shards = {}
        const pages = await this.getAuctionPagesCount()
        for (let i = 0; i < pages; i++) {
            let auction = fetch(this.baseURL + `/auctions?page=${i}`)
                .then((resp) => resp.json())
            auctions.push(auction)
        }
        let done = (await Promise.all(auctions)).map(auction => {
            return auction.auctions
        }).flat()

        const filteredArmor = done.filter(item => this.listOfEqupment.includes(item.item_name))

        const filteredShards = done.filter(item => item.item_name === 'Attribute Shard')
        filteredShards.forEach(ye => {
           let item_name = (ye.item_lore.split('\n')[0]).slice(2).replace('✖', '').replace('Combine with items in the', 'None').trim()
            if (!shards.hasOwnProperty(item_name)) {
                shards[item_name] = [ye]
            }
            else {
                shards[item_name].push(ye)
            }
        })
        this.discord.attributeShardsAuctions = shards
    }
    async getAuctionPagesCount() {
        const res = await fetch(this.baseURL + '/auctions').then(res => res.json()).catch(e => {
            console.log(e)
        });
        return res.totalPages;
    }

}

module.exports = AuctionHandler
