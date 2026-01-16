const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });
    console.log('--- Current Users in Database ---');
    console.table(users);
    console.log('---------------------------------');
  } catch (error) {
    console.error('Failed to list users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
