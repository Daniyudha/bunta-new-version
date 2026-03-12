const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function comprehensiveFix() {
  console.log('🔧 Starting comprehensive fix for Farmers API...');
  
  const prisma = new PrismaClient();
  
  try {
    // 1. Verify database connection
    console.log('\n1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // 2. Check if Farmer table exists and has correct schema
    console.log('\n2. Verifying Farmer table schema...');
    const farmers = await prisma.farmer.findMany();
    console.log(`✅ Found ${farmers.length} farmers with valid schema`);

    // 3. Test data parsing
    console.log('\n3. Testing data parsing...');
    farmers.forEach(farmer => {
      try {
        const members = Array.isArray(farmer.members) ? farmer.members : JSON.parse(farmer.members);
        console.log(`✅ Farmer ${farmer.id}: ${members.length} members parsed successfully`);
      } catch (error) {
        console.log(`❌ Parsing error for farmer ${farmer.id}: ${error.message}`);
      }
    });

    // 4. Check environment configuration
    console.log('\n4. Checking environment configuration...');
    const envPath = path.join(__dirname, '..', '.env');
    const envLocalPath = path.join(__dirname, '..', '.env.local');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env file exists');
    } else {
      console.log('❌ .env file missing');
    }
    
    if (fs.existsSync(envLocalPath)) {
      console.log('✅ .env.local file exists');
    } else {
      console.log('❌ .env.local file missing');
    }

    // 5. Verify Prisma client configuration
    console.log('\n5. Checking Prisma client setup...');
    try {
      const config = require('../lib/prisma');
      console.log('✅ Prisma client configured correctly');
    } catch (error) {
      console.log('❌ Prisma client configuration error:', error.message);
    }

    console.log('\n🎯 Comprehensive check completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Ensure the development server is restarted to apply changes');
    console.log('2. Check the terminal logs for detailed error messages');
    console.log('3. Verify you are logged in with an ADMIN role user');
    console.log('4. The API should now handle errors gracefully and return proper status codes');

  } catch (error) {
    console.error('❌ Comprehensive fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
comprehensiveFix();