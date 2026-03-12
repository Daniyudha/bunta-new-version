const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking admin user permissions...');
    
    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@buntabella.go.id' },
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

    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user:', adminUser.email);
    console.log('Role:', adminUser.role?.name);
    console.log('Permissions:', adminUser.role?.permissions.map(rp => rp.permission.name) || []);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();