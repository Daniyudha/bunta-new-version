const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing upload directories and permissions...');

// Define all upload directories that need to be created
const uploadDirs = [
  'public/uploads',
  'public/uploads/storage',
  'public/uploads/news',
  'public/uploads/gallery',
  'public/uploads/sliders',
  'public/uploads/media'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
  
  // Set proper permissions (read/write for owner, read for others)
  try {
    fs.chmodSync(fullPath, 0o755); // rwxr-xr-x
    console.log(`🔐 Set permissions for: ${dir}`);
  } catch (error) {
    console.log(`⚠️  Could not set permissions for ${dir}: ${error.message}`);
  }
});

console.log('\n✅ Upload directories setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Run the seed script to ensure permissions are correct: npm run seed');
console.log('2. Restart the application');
console.log('3. Test image uploads');