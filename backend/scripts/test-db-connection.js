const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test water level data
    const waterData = await prisma.waterLevelData.findMany({ take: 1 });
    console.log('Water level data:', waterData.length > 0 ? 'Found data' : 'No data');
    
    // Test rainfall data
    const rainfallData = await prisma.rainfallData.findMany({ take: 1 });
    console.log('Rainfall data:', rainfallData.length > 0 ? 'Found data' : 'No data');
    
    // Test crop data
    const cropData = await prisma.cropData.findMany({ take: 1 });
    console.log('Crop data:', cropData.length > 0 ? 'Found data' : 'No data');
    
    // Test farmer data
    const farmerData = await prisma.farmerData.findMany({ take: 1 });
    console.log('Farmer data:', farmerData.length > 0 ? 'Found data' : 'No data');
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();