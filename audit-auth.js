const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        password: true,
        createdAt: true
      }
    });
    
    console.log(`--- Total Users: ${users.length} ---`);
    for (const u of users) {
      const looksLikeBcrypt = u.password.startsWith('$2a$') || u.password.startsWith('$2b$') || u.password.startsWith('$2y$');
      console.log(`User: [${u.username}]`);
      console.log(`  - Hash length: ${u.password.length}`);
      console.log(`  - Valid Bcrypt format: ${looksLikeBcrypt}`);
      console.log(`  - Hash prefix: ${u.password.substring(0, 10)}...`);
    }
  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
