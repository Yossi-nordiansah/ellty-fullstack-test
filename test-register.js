const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const username = 'testuser_' + Math.floor(Math.random() * 1000);
  const password = 'password123';

  try {
    console.log(`Attempting to register user: ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log('Registration successful!');
    console.log(`User ID: ${user.id}`);
  } catch (error) {
    console.error('Registration failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
