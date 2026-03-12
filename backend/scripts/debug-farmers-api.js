const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugFarmersAPI() {
  console.log('🔍 Debugging Farmers API endpoint...');
  
  try {
    // 1. Test database connection
    console.log('\n1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // 2. Test if Farmer table exists
    console.log('\n2. Checking Farmer table existence...');
    try {
      const tableExists = await prisma.$queryRaw`
        SELECT name FROM sqlite_master WHERE type='table' AND name='Farmer'
      `;
      console.log('✅ Farmer table exists:', tableExists.length > 0);
    } catch (error) {
      console.log('❌ Error checking table existence:', error.message);
    }

    // 3. Test direct database query
    console.log('\n3. Testing direct database query...');
    const farmers = await prisma.farmer.findMany();
    console.log(`✅ Found ${farmers.length} farmers in database`);

    // 4. Test JSON parsing of members
    console.log('\n4. Testing JSON parsing...');
    farmers.forEach(farmer => {
      try {
        const parsedMembers = Array.isArray(farmer.members) 
          ? farmer.members 
          : JSON.parse(farmer.members);
        console.log(`✅ Farmer ${farmer.id}: Successfully parsed ${parsedMembers.length} members`);
      } catch (error) {
        console.log(`❌ Farmer ${farmer.id}: Error parsing members - ${error.message}`);
        console.log(`   Raw data: ${farmer.members}`);
      }
    });

    // 5. Test API endpoint with proper authentication headers
    console.log('\n5. Testing API endpoint with authentication...');
    console.log('   Note: This requires a valid session cookie. If you\'re logged in,');
    console.log('   the browser should automatically include authentication cookies.');
    
    // Test with curl-like approach to simulate browser request
    const { exec } = require('child_process');
    
    exec('curl -s -H "Cookie: $(cat /tmp/session_cookie 2>/dev/null)" http://localhost:3000/api/admin/farmers -v', 
      (error, stdout, stderr) => {
        if (error) {
          console.log('❌ API test failed:', error.message);
          return;
        }
        
        if (stderr) {
          console.log('🔧 Debug info:', stderr);
        }
        
        if (stdout) {
          try {
            const data = JSON.parse(stdout);
            console.log('✅ API Response:', JSON.stringify(data, null, 2));
          } catch (e) {
            console.log('📋 API Raw Response:', stdout);
          }
        }
      }
    );

  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative: Check server logs for detailed error information
console.log('📋 Please check your terminal where "npm run dev" is running for detailed error logs.');
console.log('   The enhanced logging in the API should show exactly where the error occurs.');
console.log('   Look for messages starting with "❌" for errors or "🔍" for debugging info.');

debugFarmersAPI();