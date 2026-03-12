const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding dashboard:view permission to ADMIN role...');
    
    // Find the ADMIN role
    const adminRole = await prisma.role.findFirst({
      where: { name: 'ADMIN' }
    });

    if (!adminRole) {
      console.log('ADMIN role not found');
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

    // Check if the permission is already assigned to ADMIN role
    const existingPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: adminRole.id,
        permissionId: dashboardPermission.id
      }
    });

    if (existingPermission) {
      console.log('ADMIN role already has dashboard:view permission');
      return;
    }

    // Add the permission to ADMIN role
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: dashboardPermission.id
      }
    });

    console.log('Successfully added dashboard:view permission to ADMIN role');
    console.log('Admin user should now be able to access the admin dashboard');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();