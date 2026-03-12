const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Fetching all roles with their permissions...');
    
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    console.log('\n=== SYSTEM ROLES ===');
    roles.forEach(role => {
      console.log(`\nRole: ${role.name} (ID: ${role.id})`);
      console.log('Permissions:');
      if (role.permissions.length > 0) {
        role.permissions.forEach(rp => {
          console.log(`  - ${rp.permission.name}`);
        });
      } else {
        console.log('  No permissions assigned');
      }
    });

    console.log('\n=== USER ACCOUNTS ===');
    const users = await prisma.user.findMany({
      include: {
        role: true
      }
    });

    users.forEach(user => {
      console.log(`User: ${user.name} (${user.email}) - Role: ${user.role.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();