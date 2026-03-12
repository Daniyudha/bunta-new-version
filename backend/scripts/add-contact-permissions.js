const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding contact submission permissions...');
    await prisma.$connect();

    // Check if permissions already exist using findFirst since name is not unique
    const existingReadPerm = await prisma.permission.findFirst({
      where: { name: 'contact_submissions:read' }
    });

    const existingEditPerm = await prisma.permission.findFirst({
      where: { name: 'contact_submissions:edit' }
    });

    // Create permissions if they don't exist
    if (!existingReadPerm) {
      await prisma.permission.create({
        data: {
          name: 'contact_submissions:read',
          description: 'View contact form submissions',
          category: 'Contact Submissions'
        }
      });
      console.log('Created permission: contact_submissions:read');
    } else {
      console.log('Permission already exists: contact_submissions:read');
    }

    if (!existingEditPerm) {
      await prisma.permission.create({
        data: {
          name: 'contact_submissions:edit',
          description: 'Edit contact form submission status',
          category: 'Contact Submissions'
        }
      });
      console.log('Created permission: contact_submissions:edit');
    } else {
      console.log('Permission already exists: contact_submissions:edit');
    }

    // Get the SUPER_ADMIN role
    const superAdminRole = await prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
      include: { permissions: { include: { permission: true } } }
    });

    if (!superAdminRole) {
      throw new Error('SUPER_ADMIN role not found');
    }

    // Get the new permissions using findFirst
    const readPermission = await prisma.permission.findFirst({
      where: { name: 'contact_submissions:read' }
    });

    const editPermission = await prisma.permission.findFirst({
      where: { name: 'contact_submissions:edit' }
    });

    // Check if SUPER_ADMIN already has these permissions
    const hasReadPerm = superAdminRole.permissions.some(
      rp => rp.permission.name === 'contact_submissions:read'
    );

    const hasEditPerm = superAdminRole.permissions.some(
      rp => rp.permission.name === 'contact_submissions:edit'
    );

    // Add permissions to SUPER_ADMIN role if not already present
    if (!hasReadPerm && readPermission) {
      await prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: readPermission.id
        }
      });
      console.log('Added contact_submissions:read to SUPER_ADMIN role');
    }

    if (!hasEditPerm && editPermission) {
      await prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: editPermission.id
        }
      });
      console.log('Added contact_submissions:edit to SUPER_ADMIN role');
    }

    console.log('Contact submission permissions setup completed successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();