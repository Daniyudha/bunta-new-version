const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Super Admin user...');

  // Check if Super Admin role already exists
  let superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' }
  });

  // Create Super Admin role if it doesn't exist
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with full system access',
        isDefault: false
      }
    });
    console.log('Created SUPER_ADMIN role');
  }

  // Get all permissions to assign to Super Admin role
  const allPermissions = await prisma.permission.findMany();
  
  // Assign all permissions to Super Admin role
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id
      }
    });
  }
  console.log(`Assigned ${allPermissions.length} permissions to SUPER_ADMIN role`);

  // Hash password
  const hashedPassword = await bcrypt.hash('Buntamengalir25!', 12);

  // Create or update Super Admin user
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'su.admin@irigasibunta.com' },
    update: {
      name: 'Super Administrator',
      password: hashedPassword,
      roleId: superAdminRole.id
    },
    create: {
      name: 'Super Administrator',
      email: 'su.admin@irigasibunta.com',
      password: hashedPassword,
      roleId: superAdminRole.id
    }
  });

  console.log('Super Admin user created/updated:');
  console.log(`- Email: su.admin@irigasibunta.com`);
  console.log(`- Password: Buntamengalir25!`);
  console.log(`- Role: SUPER_ADMIN`);
  console.log('This account cannot be deleted through the UI and has full system access.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });