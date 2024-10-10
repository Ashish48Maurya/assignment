const express = require('express');
const router = express.Router();
const service = require('../controllers/service');

router.get('/stats', service.latestData)
router.get('/deviation', service.getDeviation)
module.exports = router;