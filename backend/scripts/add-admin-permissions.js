const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAdminPermissions() {
  try {
    console.log('Adding user management permissions to ADMIN role...');

    // Find the ADMIN role
    const adminRole = await prisma.role.findFirst({
      where: { name: 'ADMIN' }
    });

    if (!adminRole) {
      console.log('ADMIN role not found');
      return;
    }

    // Find the user management permissions
    const userPermissions = await prisma.permission.findMany({
      where: {
        name: {
          in: ['users:read', 'users:create', 'users:edit', 'users:delete']
        }
      }
    });

    // Add permissions to ADMIN role
    for (const permission of userPermissions) {
      // Check if permission is already assigned
      const existingAssignment = await prisma.rolePermission.findFirst({
        where: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      });

      if (!existingAssignment) {
        await prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        });
        console.log(`Added permission: ${permission.name}`);
      } else {
        console.log(`Permission already exists: ${permission.name}`);
      }
    }

    console.log('User management permissions added to ADMIN role successfully!');

  } catch (error) {
    console.error('Error adding permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdminPermissions();