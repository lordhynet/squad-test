const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid'); // To generate unique references

// Helper function to calculate fees
const calculateFee = (value, type) => {
  return type === 'virtual_account' ? value * 0.05 : value * 0.03;
};

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, value, description, currency, cardLast4, accountName, accountNumber, bankCode } = req.body;

    // Validate input
    if (!type || !value || !description || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique transaction reference
    const reference = uuidv4();

    // Process transaction
    const transactionData = {
      reference,
      type,
      value,
      description,
      currency,
      fee: calculateFee(value, type),
      status: type === 'virtual_account' ? 'success' : 'pending',
      cardLast4: type === 'card' ? cardLast4 : null,
    };

    const transaction = await prisma.transaction.create({
      data: transactionData,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const settleTransaction = async (req, res) => {
    try {
      const { reference } = req.params;
      const { amount } = req.body; // Optional: Validate if amount is provided and correct
  
      // Find the transaction by reference
      const transaction = await prisma.transaction.findUnique({
        where: { reference },
      });
  
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
  
      if (transaction.status !== 'pending') {
        return res.status(400).json({ error: 'Transaction is not in a pending state' });
      }
  
      // Update the transaction status to 'success'
      const updatedTransaction = await prisma.transaction.update({
        where: { reference },
        data: {
          status: 'success',
        },
      });
  
      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { settleTransaction, createTransaction, getTransactions };
