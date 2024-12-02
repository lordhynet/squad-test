const express = require('express');
const { createTransaction, getTransactions, settleTransaction } = require('../controllers/transactionsController');
const authenticateProvider = require('../middlewares/authenticateProvider');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Route to create a new transaction
router.post('/', createTransaction);

// Route to fetch all transactions
router.get('/', getTransactions);

// Settlement route
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
router.patch('/:reference/settle',authenticateProvider, settleTransaction);


module.exports = router;
