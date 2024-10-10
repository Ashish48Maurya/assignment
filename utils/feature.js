const success = (status, message, data) => {
    return {
        status: status || 200,
        message: message || 'Operation successful',
        data: data || {}
    };
};

const failure = (status, message, error) => {
    return {
        status: status || 500,
        message: message || 'Operation failed',
        error: error || {}
    };
};

const calculateStandardDeviation = (prices) => {
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
    const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / prices.length;
    return Math.sqrt(variance);
  };

module.exports = {
    success,
    failure,
    calculateStandardDeviation
};
