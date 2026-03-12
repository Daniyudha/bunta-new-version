const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking farmers data for JSON parsing issues...\n');
    
    const farmers = await prisma.farmer.findMany();
    console.log(`Total farmers: ${farmers.length}`);
    
    let validCount = 0;
    let invalidCount = 0;
    let nullCount = 0;
    let emptyCount = 0;
    
    farmers.forEach((farmer, index) => {
      console.log(`\nFarmer ${index + 1}:`);
      console.log(`ID: ${farmer.id}`);
      console.log(`Name: ${farmer.name}`);
      console.log(`Group: ${farmer.group}`);
      console.log(`Chairman: ${farmer.chairman}`);
      console.log(`Members raw: ${farmer.members}`);
      console.log(`Members type: ${typeof farmer.members}`);
      
      if (farmer.members === null) {
        console.log('Members: NULL');
        nullCount++;
      } else if (farmer.members === '') {
        console.log('Members: EMPTY STRING');
        emptyCount++;
      } else {
        // Try to parse members
        try {
          const parsedMembers = Array.isArray(farmer.members) ? farmer.members : JSON.parse(farmer.members);
          console.log(`Parsed members: ${JSON.stringify(parsedMembers)}`);
          validCount++;
        } catch (error) {
          console.log(`Error parsing members: ${error.message}`);
          invalidCount++;
        }
      }
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total farmers: ${farmers.length}`);
    console.log(`Valid JSON: ${validCount}`);
    console.log(`Invalid JSON: ${invalidCount}`);
    console.log(`NULL values: ${nullCount}`);
    console.log(`Empty strings: ${emptyCount}`);
    
  } catch (error) {
    console.error('Error fetching farmers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();