const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userEmail = 'test@mail.com';
    
    console.log(`Deleting sessions for user: ${userEmail}`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Delete all sessions for this user
    const result = await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    console.log(`Deleted ${result.count} sessions for user ${userEmail}`);
    console.log('User will need to log in again to get a fresh token with updated permissions');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();