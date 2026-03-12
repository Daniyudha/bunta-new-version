const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verifying Super Admin account and permissions...');
    
    // Find the Super Admin user
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'su.admin@irigasibunta.com' },
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

    if (!superAdmin) {
      console.log('Super Admin user not found!');
      return;
    }

    console.log('Super Admin found:', superAdmin.email);
    console.log('Role:', superAdmin.role?.name);
    console.log('Permissions count:', superAdmin.role?.permissions.length || 0);
    console.log('Permissions:', superAdmin.role?.permissions.map(rp => rp.permission.name) || []);

    // Check if Super Admin has all permissions
    const allPermissions = await prisma.permission.findMany();
    const superAdminPermissions = superAdmin.role?.permissions.map(rp => rp.permission.name) || [];
    
    const missingPermissions = allPermissions.filter(
      p => !superAdminPermissions.includes(p.name)
    );

    if (missingPermissions.length > 0) {
      console.log('\nMissing permissions for Super Admin:');
      missingPermissions.forEach(p => console.log(`- ${p.name}`));
    } else {
      console.log('\nSuper Admin has all permissions ✓');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();