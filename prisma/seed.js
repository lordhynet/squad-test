const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Add sample transaction
  await prisma.transaction.create({
    data: {
      reference: 'TRX-100001',
      type: 'card',
      value: 5000,
      status: 'pending',
      fee: 150,
      cardLast4: '1234',
      description: 'Test transaction',
      currency: 'NGN',
    },
  });

  // Add sample payout
  await prisma.payout.create({
    data: {
      total: 5000,
      deductedFee: 150,
    },
  });

  console.log('Sample data added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
