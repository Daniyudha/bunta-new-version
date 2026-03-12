const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Database connected successfully!');

    // Check users
    const users = await prisma.user.findMany({
      include: { role: true },
    });
    console.log(`\nUsers (${users.length}):`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role?.name || 'None'}`);
    });

    // Check roles
    const roles = await prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
    console.log(`\nRoles (${roles.length}):`);
    roles.forEach(role => {
      console.log(`\n- ${role.name} (${role.description})`);
      console.log(`  Permissions (${role.permissions.length}):`);
      role.permissions.forEach(rp => {
        console.log(`  * ${rp.permission.name} - ${rp.permission.description}`);
      });
    });

    // Check permissions
    const permissions = await prisma.permission.findMany();
    console.log(`\nAll Permissions (${permissions.length}):`);
    permissions.forEach(perm => {
      console.log(`- ${perm.name} (${perm.category}) - ${perm.description}`);
    });


  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();