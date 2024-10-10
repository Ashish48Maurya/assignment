const axios = require('axios');
const Crypto = require('../models/Coin')
const {success: generateSuccessResponse,failure: generateFailureResponse} = require('../utils/feature')

exports.fetchCryptoData = async () => {
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
    const coinsIds = ["bitcoin","ethereum","matic-network"]
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
    return success(response.status, 'Data fetched and stored in DB Successfully', coinsArray);

  } catch (error) {
    return failure(500, `Error fetching data: ${error.message}`, error.message)
  }
};