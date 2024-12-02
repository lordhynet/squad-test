const express = require('express');
const { getBalance } = require('../controllers/balancesController');

const router = express.Router();

// Route to fetch merchant balances
router.get('/', getBalance);

module.exports = router;
