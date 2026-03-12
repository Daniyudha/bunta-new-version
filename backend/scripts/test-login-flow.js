const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin(email, password) {
  try {
    console.log(`Testing login for: ${email}`);
    
    // Simulate the authorize function from auth.ts
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    console.log('User found:', user ? user.email : 'Not found');

    if (!user || !user.password) {
      console.log('User not found or no password');
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return null;
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name || 'USER',
      permissions: user.role?.permissions.map(rp => rp.permission.name) || []
    };

    console.log('Login successful. User data:', {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      permissions: userData.permissions
    });

    // Test permission-based access
    console.log('\nTesting permission-based access:');
    console.log('Has dashboard:view permission:', userData.permissions.includes('dashboard:view'));
    console.log('Has users:read permission:', userData.permissions.includes('users:read'));
    console.log('Has news:read permission:', userData.permissions.includes('news:read'));

    return userData;

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function main() {
  try {
    console.log('Testing login flow for different users...\n');

    // Test Super Admin
    console.log('=== Testing Super Admin ===');
    await testLogin('su.admin@irigasibunta.com', 'SuperAdmin123!');
    console.log('\n');

    // Test Admin
    console.log('=== Testing Admin ===');
    await testLogin('admin@buntabella.go.id', 'Admin123!');
    console.log('\n');

    // Test Super Admin
    console.log('=== Testing Super Admin ===');
    await testLogin('su.admin@irigasibunta.com', 'SuperAdmin123!');
    console.log('\n');

    // Test Admin
    console.log('=== Testing Admin ===');
    await testLogin('admin@buntabella.go.id', 'Admin123!');
    console.log('\n');

    // Test regular user
    console.log('=== Testing Regular User ===');
    await testLogin('test@mail.com', 'password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();