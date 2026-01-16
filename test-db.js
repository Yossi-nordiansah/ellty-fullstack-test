const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log('Database connection successful!');
    console.log(`Current user count: ${userCount}`);
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
