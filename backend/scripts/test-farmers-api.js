const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFarmersAPI() {
  console.log('Testing Farmers API endpoint...');
  
  try {
    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Database connection successful');
    
    // Test fetching farmers directly
    console.log('\nTesting direct database query...');
    const farmers = await prisma.farmer.findMany();
    console.log(`✓ Found ${farmers.length} farmers in database`);
    
    // Test parsing members data
    console.log('\nTesting members JSON parsing...');
    farmers.forEach(farmer => {
      try {
        const parsedMembers = Array.isArray(farmer.members) 
          ? farmer.members 
          : JSON.parse(farmer.members);
        console.log(`✓ Farmer ${farmer.id}: Successfully parsed ${parsedMembers.length} members`);
      } catch (error) {
        console.log(`✗ Farmer ${farmer.id}: Error parsing members - ${error.message}`);
      }
    });
    
    // Test API endpoint with fetch
    console.log('\nTesting API endpoint...');
    const response = await fetch('http://localhost:3000/api/admin/farmers', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`API Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ API Response Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('✗ API Error Response:', errorText);
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFarmersAPI();