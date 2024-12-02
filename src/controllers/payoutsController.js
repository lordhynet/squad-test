const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to calculate total payout amount after fees
const calculateNetPayout = (transactions) => {
  let totalPayout = 0;

  transactions.forEach((txn) => {
    const fee = txn.type === 'card' ? txn.value * 0.03 : txn.value * 0.05;
    totalPayout += txn.value - fee;
  });

  return totalPayout;
};

// Create a new payout
const createPayout = async (req, res) => {
  try {
    // Fetch all settled transactions
    const settledTransactions = await prisma.transaction.findMany({
      where: { status: 'success' },
    });

    if (settledTransactions.length === 0) {
      return res.status(400).json({ error: 'No settled transactions available for payout' });
    }

    // Calculate the total payout amount
    const total = calculateNetPayout(settledTransactions);

    // Deduct fees from transactions
    const deductedFee = settledTransactions.reduce((acc, txn) => {
      const fee = txn.type === 'card' ? txn.value * 0.03 : txn.value * 0.05;
      return acc + fee;
    }, 0);

    // Create the payout record
    const payout = await prisma.payout.create({
      data: {
        total,
        deductedFee,
      },
    });

    // Update the transactions as processed (optional)
    await prisma.transaction.updateMany({
      where: { status: 'success' },
      data: { status: 'payout_processed' },
    });

    res.status(201).json(payout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all payouts
const getPayouts = async (req, res) => {
  try {
    const payouts = await prisma.payout.findMany();
    res.status(200).json(payouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createPayout, getPayouts };
