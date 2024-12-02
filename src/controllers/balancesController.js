const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch balances
const getBalance = async (req, res) => {
  try {
    // Calculate total of settled (success) transactions
    const settledTransactions = await prisma.transaction.findMany({
      where: { status: 'success' },
    });

    const availableBalance = settledTransactions.reduce((acc, txn) => {
      const fee = txn.type === 'card' ? txn.value * 0.03 : txn.value * 0.05;
      return acc + (txn.value - fee);
    }, 0);

    // Calculate total of pending transactions
    const pendingTransactions = await prisma.transaction.findMany({
      where: { status: 'pending' },
    });

    const pendingSettlementBalance = pendingTransactions.reduce((acc, txn) => acc + txn.value, 0);

    // Subtract payouts from the available balance
    const payouts = await prisma.payout.findMany();
    const totalPayouts = payouts.reduce((acc, payout) => acc + payout.total, 0);

    const finalAvailableBalance = availableBalance - totalPayouts;

    // Send the response
    res.status(200).json({
      available: finalAvailableBalance,
      pending_settlement: pendingSettlementBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getBalance };
