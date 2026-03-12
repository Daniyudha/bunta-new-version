const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Listing all users with their roles and permissions...');
    
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    users.forEach(user => {
      console.log('\n---');
      console.log('User:', user.email);
      console.log('Role:', user.role?.name || 'No role');
      console.log('Permissions:', user.role?.permissions.map(rp => rp.permission.name) || []);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();