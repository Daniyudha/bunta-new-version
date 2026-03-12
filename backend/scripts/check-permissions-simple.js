const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking permissions count...');
  
  const count = await prisma.permission.count();
  console.log(`📊 Database permissions count: ${count}`);
  
  const expectedCount = 56; // From seed-permissions.js
  console.log(`📋 Expected permissions count: ${expectedCount}`);
  
  if (count === expectedCount) {
    console.log('✅ Permissions count matches expected value.');
  } else {
    console.log(`❌ Permissions count discrepancy: ${count} vs ${expectedCount}`);
    console.log('💡 Run "node scripts/seed-permissions.js" to synchronize.');
  }
}

main()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());