const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking user passwords...');
    
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'su.admin@irigasibunta.com',
            'admin@buntabella.go.id',
            'test@mail.com'
          ]
        }
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    users.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log(`Password hash: ${user.password}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();