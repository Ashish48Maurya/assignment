const generateSuccessResponse = (status, message, data) => {
    return {
        status: status || 200,
        message: message || 'Operation successful',
        data: data || {}
    };
};

const generateFailureResponse = (status, message, error) => {
    return {
        status: status || 500,
        message: message || 'Operation failed',
        error: error || {}
    };
};

module.exports = {
    generateSuccessResponse,
    generateFailureResponse
};
