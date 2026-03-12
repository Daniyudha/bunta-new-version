const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFarmersData() {
  try {
    console.log('Checking Farmer data in database...');
    
    // Check if Farmer table exists and has data
    const farmers = await prisma.farmer.findMany();
    console.log(`Found ${farmers.length} farmers in database`);
    
    if (farmers.length > 0) {
      console.log('\nSample farmer data:');
      farmers.slice(0, 3).forEach((farmer, index) => {
        console.log(`\nFarmer ${index + 1}:`);
        console.log(`  ID: ${farmer.id}`);
        console.log(`  Name: ${farmer.name}`);
        console.log(`  Group: ${farmer.group}`);
        console.log(`  Chairman: ${farmer.chairman}`);
        console.log(`  Members type: ${typeof farmer.members}`);
        console.log(`  Members value: ${JSON.stringify(farmer.members, null, 2)}`);
        
        // Check if members can be parsed
        try {
          const parsedMembers = Array.isArray(farmer.members) 
            ? farmer.members 
            : JSON.parse(farmer.members);
          console.log(`  Parsed members successfully: ${Array.isArray(parsedMembers) ? parsedMembers.length + ' items' : 'Not an array'}`);
        } catch (parseError) {
          console.log(`  Error parsing members: ${parseError.message}`);
        }
      });
    } else {
      console.log('No farmers found in database. Please run the seed script.');
    }
    
    // Check database connection and schema
    const tableInfo = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='Farmer'
    `.catch(() => []);
    
    console.log('\nDatabase schema check:');
    if (tableInfo.length > 0) {
      console.log('✓ Farmer table exists in database');
    } else {
      console.log('✗ Farmer table does not exist in database');
    }
    
  } catch (error) {
    console.error('Error checking farmers data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFarmersData();