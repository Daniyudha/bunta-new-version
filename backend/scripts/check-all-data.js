const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking all data tables...\n');
    
    // Check water level data
    const waterLevelData = await prisma.waterLevelData.findMany();
    console.log(`Water level data: ${waterLevelData.length} records`);
    
    // Check rainfall data
    const rainfallData = await prisma.rainfallData.findMany();
    console.log(`Rainfall data: ${rainfallData.length} records`);
    
    // Check crop data
    const cropData = await prisma.cropData.findMany();
    console.log(`Crop data: ${cropData.length} records`);
    
    // Check farmer data
    const farmerData = await prisma.farmer.findMany();
    console.log(`Farmer data: ${farmerData.length} records`);
    
    // Check if any data exists
    const totalData = waterLevelData.length + rainfallData.length + cropData.length + farmerData.length;
    console.log(`\nTotal data records: ${totalData}`);
    
    if (totalData === 0) {
      console.log('\nNo data found in any table. You may need to add some data first.');
    }
    
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();