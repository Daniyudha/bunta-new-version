const prisma = require('./src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'su.admin@irigasibunta.com';
  const plainPassword = 'Buntamengalir25!';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User password hash:', user.password);
  console.log('Plain password:', plainPassword);
  
  const isValid = await bcrypt.compare(plainPassword, user.password);
  console.log('Password valid?', isValid);
  
  // Also hash the plain password to see the hash
  const newHash = await bcrypt.hash(plainPassword, 12);
  console.log('New hash:', newHash);
  console.log('Match with stored?', newHash === user.password);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});