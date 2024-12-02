const express = require('express');
const { createPayout, getPayouts } = require('../controllers/payoutsController');

const router = express.Router();

// Route to create a new payout
router.post('/', createPayout);

// Route to fetch all payouts
router.get('/', getPayouts);

module.exports = router;
