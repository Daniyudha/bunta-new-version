const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Create or get ADMIN role
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator role with full access',
    },
  });

  // Create admin user with role
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@buntabella.go.id' },
    update: {
      roleId: adminRole.id,
    },
    create: {
      email: 'admin@buntabella.go.id',
      name: 'Administrator',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });