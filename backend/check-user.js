const prisma = require('./src/lib/prisma');

async function main() {
  console.log('Checking user su.admin@irigasibunta.com...');
  const user = await prisma.user.findUnique({
    where: { email: 'su.admin@irigasibunta.com' },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true }
          }
        }
      }
    }
  });
  if (user) {
    console.log('User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password ? '*** hashed ***' : 'null',
      role: user.role?.name,
      permissions: user.role?.permissions.map(rp => rp.permission.name) || []
    });
  } else {
    console.log('User not found.');
  }
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});