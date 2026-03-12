const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Resetting passwords for all users...');
    
    // Define users and their new passwords
    const users = [
      { email: 'su.admin@irigasibunta.com', password: 'SuperAdmin123!' },
      { email: 'admin@buntabella.go.id', password: 'Admin123!' },
      { email: 'test@mail.com', password: 'password123' }
    ];

    for (const user of users) {
      console.log(`Resetting password for: ${user.email}`);
      
      // Find the user
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (!existingUser) {
        console.log(`User ${user.email} not found`);
        continue;
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(user.password, 12);

      // Update the password
      await prisma.user.update({
        where: { email: user.email },
        data: { password: hashedPassword }
      });

      console.log(`Password reset for ${user.email} to: ${user.password}`);
    }

    console.log('All passwords reset successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();