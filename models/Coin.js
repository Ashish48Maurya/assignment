const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    coins: [
        {
            coinId: String,
            usd: Number,
            usd_market_cap: Number,
            usd_24h_change: Number,
        }
    ]
}, {
    timestamps: true
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;