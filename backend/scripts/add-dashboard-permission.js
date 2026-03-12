const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding dashboard:view permission to admin roles...');
    
    // Find the ADMIN and SUPER_ADMIN roles
    const adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' }
    });

    const superAdminRole = await prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' }
    });

    if (!adminRole && !superAdminRole) {
      console.log('No admin roles found in system');
      return;
    }

    // Find the dashboard:view permission
    const dashboardPermission = await prisma.permission.findFirst({
      where: { name: 'dashboard:view' }
    });

    if (!dashboardPermission) {
      console.log('dashboard:view permission not found in system');
      return;
    }

    const rolesToUpdate = [];
    if (adminRole) rolesToUpdate.push(adminRole);
    if (superAdminRole) rolesToUpdate.push(superAdminRole);

    for (const role of rolesToUpdate) {
      // Check if the permission is already assigned
      const existingPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: role.id,
          permissionId: dashboardPermission.id
        }
      });

      if (existingPermission) {
        console.log(`${role.name} role already has dashboard:view permission`);
        continue;
      }

      // Add the permission
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: dashboardPermission.id
        }
      });

      console.log(`Successfully added dashboard:view permission to ${role.name} role`);
    }

    console.log('Dashboard permission setup completed successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();