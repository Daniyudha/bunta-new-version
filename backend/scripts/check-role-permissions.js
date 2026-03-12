const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRolePermissions() {
  try {
    // Find the ADMIN role
    const adminRole = await prisma.role.findFirst({
      where: { name: 'ADMIN' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!adminRole) {
      console.log('ADMIN role not found');
      return;
    }

    console.log('ADMIN role permissions:');
    adminRole.permissions.forEach((rp) => {
      console.log(`- ${rp.permission.name}: ${rp.permission.description}`);
    });

    // Check if users:create permission exists
    const hasUserCreate = adminRole.permissions.some(
      (rp) => rp.permission.name === 'users:create'
    );

    console.log(`\nHas users:create permission: ${hasUserCreate}`);

    // Also check SUPER_ADMIN role for comparison
    const superAdminRole = await prisma.role.findFirst({
      where: { name: 'SUPER_ADMIN' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (superAdminRole) {
      console.log('\nSUPER_ADMIN role permissions:');
      superAdminRole.permissions.forEach((rp) => {
        console.log(`- ${rp.permission.name}: ${rp.permission.description}`);
      });

      const superHasUserCreate = superAdminRole.permissions.some(
        (rp) => rp.permission.name === 'users:create'
      );
      console.log(`\nSUPER_ADMIN has users:create permission: ${superHasUserCreate}`);
    }

  } catch (error) {
    console.error('Error checking role permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRolePermissions();