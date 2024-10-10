const express = require('express');
const router = express.Router();
const service = require('../controllers/service');

router.get('/count',authMiddleware, service.countUsers)
module.exports = router;