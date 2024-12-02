const express = require('express');
const transactionRoutes = require('./transactions'); // Ensure this file exists
const payoutRoutes = require('./payouts');           // Ensure this file exists
const balanceRoutes = require('./balances');         // Ensure this file exists

const router = express.Router();

// Health check endpoint for "/v1/"
router.get('/', (req, res) => {
    res.status(200).json({ message: 'It Works' });
  });
  

// Group routes
router.use('/transactions', transactionRoutes);
router.use('/payouts', payoutRoutes);
router.use('/balances', balanceRoutes);

module.exports = router;
