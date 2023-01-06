const it = require("node:test");

class AuctionHandler {
    constructor(discord) {
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
        }).flat().filter(item => item.item_name === 'Attribute Shard')
        done.forEach(ye => {
           let item_name = (ye.item_lore.split('\n')[0]).slice(2).replace('✖', '').replace('Combine with items in the', 'None').trim()
            if (!shards.hasOwnProperty(item_name)) {
                shards[item_name] = [ye]
            }
            else {
                shards[item_name].push(ye)
            }
        })
        this.discord.attributeAuctions = shards
    }
    async getAuctionPagesCount() {
        const res = await fetch(this.baseURL + '/auctions').then(res => res.json()).catch(e => {
            console.log(e)
        });
        return res.totalPages;
    }

}

module.exports = AuctionHandler
