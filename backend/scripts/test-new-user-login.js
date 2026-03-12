const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing login for test@mail.com...');
    
    // Simulate the authorize function from auth.ts
    const credentials = {
      email: 'test@mail.com',
      password: 'password' // assuming default password
    };

    if (!credentials.email || !credentials.password) {
      console.log('Missing email or password');
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email
      },
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
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return;
    }

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name || 'USER',
      permissions: user.role?.permissions.map(rp => rp.permission.name) || []
    };

    console.log('Login successful. User data:', userData);
    console.log('Permissions:', userData.permissions);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();