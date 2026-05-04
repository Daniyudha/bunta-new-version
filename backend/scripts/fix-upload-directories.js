const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing upload directories and permissions...');

// Upload directories are relative to the frontend/public/ directory
// because all Express multer routes save to frontend/public/uploads/
const frontendPublicDir = path.join(__dirname, '../../frontend/public');

// Define all upload directories that need to be created
const uploadDirs = [
  'uploads',
  'uploads/storage',
  'uploads/news',
  'uploads/gallery',
  'uploads/sliders',
  'uploads/media',
  'uploads/employees',
  'uploads/irrigation'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(frontendPublicDir, dir);
  
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