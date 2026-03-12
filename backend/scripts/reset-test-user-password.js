const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const userEmail = 'test@mail.com';
    const newPassword = 'password123'; // Simple password for testing
    
    console.log(`Resetting password for user: ${userEmail}`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    });

    console.log('Password reset successfully');
    console.log('New password:', newPassword);
    console.log('You can now login with this password');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();