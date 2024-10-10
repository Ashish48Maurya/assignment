const axios = require('axios');
const Crypto = require('../models/Coin');
const { success, failure, calculateStandardDeviation } = require('../utils/feature');

exports.fetchCryptoData = async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,matic-network',
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true,
        precision: 'full'
      },
      headers: {
        'accept': 'application/json',
        'x-cg-demo-api-key': process.env.COIN_GECKO
      }
    });

    const data = response.data;
    const coinsIds = ["bitcoin", "ethereum", "matic-network"];
    const coinsArray = [];

    for (let i = 0; i < coinsIds.length; i++) {
      const coinId = coinsIds[i];
      coinsArray.push({
        coinId: coinId,
        usd: data[coinId].usd,
        usd_market_cap: data[coinId].usd_market_cap,
        usd_24h_change: data[coinId].usd_24h_change
      });
    }

    const cryptoData = new Crypto({
      coins: coinsArray
    });

    await cryptoData.save();
    return res.status(200).json(success(200, 'Data fetched and stored in DB successfully', coinsArray));

  } catch (error) {
    return res.status(500).json(failure(500, `Error fetching data: ${error.message}`, error.message));
  }
};


exports.latestData = async (req, res) => {
  try {
    const { coinId } = req.query;
    if (!coinId) {
      return res.status(400).json(failure(400, 'coinId query parameter is required'));
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true,
        precision: 'full'
      },
      headers: {
        'accept': 'application/json',
        'x-cg-demo-api-key': process.env.COIN_GECKO
      }
    });

    const data = response.data;
    return res.status(200).json(success(200, 'Data fetched successfully', data));
  } catch (error) {
    return res.status(500).json(failure(500, `Error fetching data: ${error.message}`, error.message));
  }
};


exports.getDeviation = async (req, res) => {
  try {
    const { coinId } = req.query;
    if (!coinId) {
      return res.status(400).json(failure(400, 'coinId query parameter is required'));
    }
    const cryptoData = await Crypto.aggregate([
      { $unwind: "$coins" },
      { $match: { "coins.coinId": coinId } },
      { $sort: { "coins.last_updated_at": -1 } },
      { $limit: 100 },
      { $group: { _id: null, prices: { $push: "$coins.usd" } } }
    ]);

    if (cryptoData.length === 0) {
      return res.status(404).json(failure(404, `No data found for coinId: ${coinId}`));
    }

    const prices = cryptoData[0].prices;
    const deviation = calculateStandardDeviation(prices);

    return res.status(200).json(success(200, `Standard deviation for ${coinId} calculated successfully`, {
      coinId,
      deviation,
      recordsConsidered: prices.length
    }));

  } catch (error) {
    return res.status(500).json(failure(500, `Error calculating standard deviation: ${error.message}`, error.message));
  }
};
