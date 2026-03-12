const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Define all system permissions with categories
const permissions = [
  // News Management Permissions
  { name: 'news:read', description: 'View news articles', category: 'News' },
  { name: 'news:create', description: 'Create new news articles', category: 'News' },
  { name: 'news:edit', description: 'Edit existing news articles', category: 'News' },
  { name: 'news:delete', description: 'Delete news articles', category: 'News' },
  { name: 'news:publish', description: 'Publish/unpublish news articles', category: 'News' },

  // User Management Permissions
  { name: 'users:read', description: 'View user accounts', category: 'Users' },
  { name: 'users:create', description: 'Create new user accounts', category: 'Users' },
  { name: 'users:edit', description: 'Edit user accounts', category: 'Users' },
  { name: 'users:delete', description: 'Delete user accounts', category: 'Users' },
  { name: 'users:roles', description: 'Manage user roles and permissions', category: 'Users' },

  // Role Management Permissions
  { name: 'roles:read', description: 'View roles', category: 'Roles' },
  { name: 'roles:create', description: 'Create new roles', category: 'Roles' },
  { name: 'roles:edit', description: 'Edit roles', category: 'Roles' },
  { name: 'roles:delete', description: 'Delete roles', category: 'Roles' },
  { name: 'roles:permissions', description: 'Manage role permissions', category: 'Roles' },

  // Category Management Permissions
  { name: 'categories:read', description: 'View categories', category: 'Categories' },
  { name: 'categories:create', description: 'Create new categories', category: 'Categories' },
  { name: 'categories:edit', description: 'Edit categories', category: 'Categories' },
  { name: 'categories:delete', description: 'Delete categories', category: 'Categories' },

  // Media Management Permissions
  { name: 'media:read', description: 'View media files', category: 'Media' },
  { name: 'media:upload', description: 'Upload new media files', category: 'Media' },
  { name: 'media:edit', description: 'Edit media files', category: 'Media' },
  { name: 'media:delete', description: 'Delete media files', category: 'Media' },

  // Gallery Management Permissions
  { name: 'gallery:read', description: 'View gallery items', category: 'Gallery' },
  { name: 'gallery:create', description: 'Create new gallery items', category: 'Gallery' },
  { name: 'gallery:edit', description: 'Edit gallery items', category: 'Gallery' },
  { name: 'gallery:delete', description: 'Delete gallery items', category: 'Gallery' },

  // Data Management Permissions
  { name: 'data:read', description: 'View data records', category: 'Data' },
  { name: 'data:create', description: 'Create new data records', category: 'Data' },
  { name: 'data:edit', description: 'Edit data records', category: 'Data' },
  { name: 'data:delete', description: 'Delete data records', category: 'Data' },
  { name: 'data:export', description: 'Export data', category: 'Data' },

  // Settings Permissions
  { name: 'settings:read', description: 'View system settings', category: 'Settings' },
  { name: 'settings:edit', description: 'Edit system settings', category: 'Settings' },

  // Dashboard Permissions
  { name: 'dashboard:view', description: 'View admin dashboard', category: 'Dashboard' },

  // Reports Permissions
  { name: 'reports:view', description: 'View reports', category: 'Reports' },
  { name: 'reports:generate', description: 'Generate reports', category: 'Reports' },

  // Storage Management Permissions
  { name: 'storage:read', description: 'View storage files', category: 'Storage' },
  { name: 'storage:upload', description: 'Upload files to storage', category: 'Storage' },
  { name: 'storage:edit', description: 'Edit storage files', category: 'Storage' },
  { name: 'storage:delete', description: 'Delete storage files', category: 'Storage' },
  { name: 'storage:manage', description: 'Manage storage system', category: 'Storage' },

  // Farmer Group Management Permissions
  { name: 'farmer_groups:read', description: 'View farmer groups', category: 'Farmer Groups' },
  { name: 'farmer_groups:create', description: 'Create new farmer groups', category: 'Farmer Groups' },
  { name: 'farmer_groups:edit', description: 'Edit farmer groups', category: 'Farmer Groups' },
  { name: 'farmer_groups:delete', description: 'Delete farmer groups', category: 'Farmer Groups' },

  // Contact Submissions Management Permissions
  { name: 'contact_submissions:read', description: 'View contact submissions', category: 'Contact Submissions' },
  { name: 'contact_submissions:edit', description: 'Edit contact submissions', category: 'Contact Submissions' },

  // Irrigation Data Permissions
  { name: 'irrigation:read', description: 'View irrigation data', category: 'Irrigation' },
  { name: 'irrigation:create', description: 'Create irrigation data', category: 'Irrigation' },
  { name: 'irrigation:edit', description: 'Edit irrigation data', category: 'Irrigation' },
  { name: 'irrigation:delete', description: 'Delete irrigation data', category: 'Irrigation' },

  // Slider Management Permissions
  { name: 'sliders:read', description: 'View sliders', category: 'Sliders' },
  { name: 'sliders:create', description: 'Create new sliders', category: 'Sliders' },
  { name: 'sliders:edit', description: 'Edit sliders', category: 'Sliders' },
  { name: 'sliders:delete', description: 'Delete sliders', category: 'Sliders' },

  // Employee Management Permissions
  { name: 'employees:read', description: 'View employees', category: 'Employees' },
  { name: 'employees:create', description: 'Create new employees', category: 'Employees' },
  { name: 'employees:edit', description: 'Edit employees', category: 'Employees' },
  { name: 'employees:delete', description: 'Delete employees', category: 'Employees' },
];

async function seedPermissions() {
  console.log('Seeding system permissions...');

  for (const permissionData of permissions) {
    const existingPermission = await prisma.permission.findFirst({
      where: { name: permissionData.name }
    });

    if (existingPermission) {
      await prisma.permission.update({
        where: { id: existingPermission.id },
        data: {
          description: permissionData.description,
          category: permissionData.category,
        },
      });
      console.log(`Updated permission: ${permissionData.name}`);
    } else {
      await prisma.permission.create({
        data: permissionData,
      });
      console.log(`Created permission: ${permissionData.name}`);
    }
  }

  console.log('Permissions seeded successfully!');
}

async function seedRolesAndUsers() {
  console.log('Seeding roles and users...');

  // Create or update SUPER_ADMIN role
  let superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' }
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with full system access',
        isDefault: false
      }
    });
    console.log('Created SUPER_ADMIN role');
  }

  // Create or update ADMIN role
  let adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' }
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: 'ADMIN',
        description: 'Administrator role with full access',
        isDefault: false
      }
    });
    console.log('Created ADMIN role');
  }

  // Get all permissions to assign to both roles
  const allPermissions = await prisma.permission.findMany();
  
  // Assign all permissions to SUPER_ADMIN role
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id
      }
    });
  }
  console.log(`Assigned ${allPermissions.length} permissions to SUPER_ADMIN role`);

  // Assign all permissions to ADMIN role
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    });
  }
  console.log(`Assigned ${allPermissions.length} permissions to ADMIN role`);

  // Hash passwords
  const superAdminPassword = await bcrypt.hash('Buntamengalir25!', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  // Create or update Super Admin user
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'su.admin@irigasibunta.com' },
    update: {
      name: 'Super Administrator',
      password: superAdminPassword,
      roleId: superAdminRole.id
    },
    create: {
      name: 'Super Administrator',
      email: 'su.admin@irigasibunta.com',
      password: superAdminPassword,
      roleId: superAdminRole.id
    }
  });

  // Create or update Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@buntabella.go.id' },
    update: {
      name: 'Administrator',
      password: adminPassword,
      roleId: adminRole.id
    },
    create: {
      name: 'Administrator',
      email: 'admin@buntabella.go.id',
      password: adminPassword,
      roleId: adminRole.id
    }
  });

  console.log('\n=== Users Created/Updated ===');
  console.log('Super Admin:');
  console.log(`- Email: su.admin@irigasibunta.com`);
  console.log(`- Password: Buntamengalir25!`);
  console.log(`- Role: SUPER_ADMIN`);
  
  console.log('\nAdmin:');
  console.log(`- Email: admin@buntabella.go.id`);
  console.log(`- Password: admin123`);
  console.log(`- Role: ADMIN`);
  
  console.log('\nBoth accounts have full system access with all permissions.');
}

async function seedCategories() {
  console.log('Seeding default categories...');
  
  const categories = [
    { name: 'Berita', slug: 'berita', description: 'Berita terkini' },
    { name: 'Pengumuman', slug: 'pengumuman', description: 'Pengumuman resmi' },
    { name: 'Artikel', slug: 'artikel', description: 'Artikel informatif' },
    { name: 'Kegiatan', slug: 'kegiatan', description: 'Kegiatan dan acara' }
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData
    });
    console.log(`Seeded category: ${categoryData.name}`);
  }
}

async function seedEmployees() {
  console.log('Seeding sample employees...');

  // Delete existing employees to avoid duplicates
  await prisma.employee.deleteMany();
  console.log('Cleared existing employees.');

  const employees = [
    { name: 'Untung', position: 'Pengamat', education: 'S1 Teknik Sipil', status: 'PNS', department: 'Pimpinan', age: 45, workRegion: 'Luwuk Banggai', order: 1 },
    { name: 'Ahmad Fauzi Ridwan, A.Md.', position: 'Juru Operasi dan Pemeliharaan', education: 'D3 Teknik Sipil', status: 'PNS', department: 'Operasi & Pemeliharaan', age: 38, workRegion: 'Luwuk Banggai', order: 2 },
    { name: 'Rahmatul Ummah', position: 'Staf Operasi', education: 'S1 Teknik Lingkungan', status: 'PNS', department: 'Operasi & Pemeliharaan', age: 32, workRegion: 'Luwuk Banggai', order: 3 },
    { name: 'Rahmat Hidayat', position: 'Staf Pemeliharaan', education: 'SMA', status: 'Honorer', department: 'Operasi & Pemeliharaan', age: 28, workRegion: 'Luwuk Banggai', order: 4 },
    { name: 'Syarifudin', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 35, workRegion: 'Bunta', order: 5 },
    { name: 'Abdul Rahim', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 40, workRegion: 'Bunta', order: 6 },
    { name: 'M. Yusuf', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 33, workRegion: 'Bunta', order: 7 },
    { name: 'Samsul Bahri', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 36, workRegion: 'Bunta', order: 8 },
    { name: 'Rusli', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 39, workRegion: 'Bunta', order: 9 },
    { name: 'Junaidi', position: 'Petugas Pintu Air', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 31, workRegion: 'Bunta', order: 10 },
    { name: 'Aswan', position: 'Petugas Operasi Bendung', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 42, workRegion: 'Bunta', order: 11 },
    { name: 'Rudi Hartono', position: 'Petugas Operasi Bendung', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 37, workRegion: 'Bunta', order: 12 },
    { name: 'Fajar', position: 'Petugas Operasi Bendung', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 29, workRegion: 'Bunta', order: 13 },
    { name: 'Budi Santoso', position: 'Petugas Operasi Bendung', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 34, workRegion: 'Bunta', order: 14 },
    { name: 'Herman', position: 'Petugas Operasi Bendung', education: 'SMA', status: 'Honorer', department: 'Teknis', age: 41, workRegion: 'Bunta', order: 15 },
  ];

  for (const emp of employees) {
    await prisma.employee.create({
      data: emp,
    });
    console.log(`Seeded employee: ${emp.name} - ${emp.position}`);
  }

  console.log('✅ Employee seeding completed.');
}

async function seedIrrigationProfiles() {
  console.log('Seeding irrigation profiles...');

  // Delete existing profiles to avoid duplicates
  await prisma.irrigationProfile.deleteMany();
  console.log('Cleared existing irrigation profiles.');

  const profiles = [
    { name: 'Bendungan Bunta', description: 'Bendungan utama di Sungai Bunta', location: 'Bunta', latitude: -0.891, longitude: 122.257, area: 120.5, waterLevel: 4.2, status: 'normal', canals: 3, gates: 5, waterSource: 'Sungai Bunta' },
    { name: 'Irigasi Tondok', description: 'Jaringan irigasi di Desa Tondok', location: 'Tondok', latitude: -0.902, longitude: 122.245, area: 85.0, waterLevel: 3.8, status: 'normal', canals: 2, gates: 3, waterSource: 'Sungai Tondok' },
    { name: 'Saluran Induk Luwuk', description: 'Saluran induk wilayah Luwuk', location: 'Luwuk', latitude: -0.878, longitude: 122.312, area: 200.0, waterLevel: 5.1, status: 'high', canals: 4, gates: 8, waterSource: 'Sungai Luwuk' },
    { name: 'Irigasi Banggai', description: 'Sistem irigasi tradisional Banggai', location: 'Banggai', latitude: -1.012, longitude: 122.512, area: 150.0, waterLevel: 2.9, status: 'low', canals: 3, gates: 4, waterSource: 'Sungai Banggai' },
    { name: 'Bendungan Salu', description: 'Bendungan kecil di Salu', location: 'Salu', latitude: -0.925, longitude: 122.198, area: 65.5, waterLevel: 3.5, status: 'normal', canals: 1, gates: 2, waterSource: 'Sungai Salu' },
    { name: 'Irigasi Permai', description: 'Jaringan irigasi permukiman', location: 'Permai', latitude: -0.845, longitude: 122.275, area: 95.0, waterLevel: 4.0, status: 'normal', canals: 2, gates: 3, waterSource: 'Mata Air Permai' },
    { name: 'Saluran Sekunder Bolano', description: 'Saluran sekunder Bolano', location: 'Bolano', latitude: -0.812, longitude: 122.332, area: 110.0, waterLevel: 4.5, status: 'normal', canals: 2, gates: 4, waterSource: 'Sungai Bolano' },
    { name: 'Irigasi Lembah Hijau', description: 'Irigasi untuk lahan pertanian hijau', location: 'Lembah Hijau', latitude: -0.932, longitude: 122.289, area: 180.0, waterLevel: 3.2, status: 'low', canals: 3, gates: 6, waterSource: 'Sungai Lembah' },
    { name: 'Bendungan Mopu', description: 'Bendungan Mopu untuk pengendalian banjir', location: 'Mopu', latitude: -0.958, longitude: 122.401, area: 140.0, waterLevel: 5.8, status: 'high', canals: 3, gates: 7, waterSource: 'Sungai Mopu' },
    { name: 'Irigasi Pantura', description: 'Irigasi pesisir pantai utara', location: 'Pantura', latitude: -0.765, longitude: 122.521, area: 75.0, waterLevel: 2.5, status: 'critical', canals: 1, gates: 2, waterSource: 'Air Tanah' },
    { name: 'Saluran Tersier Sidoarjo', description: 'Saluran tersier untuk persawahan', location: 'Sidoarjo', latitude: -0.888, longitude: 122.367, area: 50.0, waterLevel: 3.0, status: 'normal', canals: 1, gates: 1, waterSource: 'Sungai Sidoarjo' },
    { name: 'Irigasi Bukit Tinggi', description: 'Irigasi di daerah perbukitan', location: 'Bukit Tinggi', latitude: -0.912, longitude: 122.112, area: 90.0, waterLevel: 4.8, status: 'normal', canals: 2, gates: 3, waterSource: 'Mata Air Bukit' },
    { name: 'Bendungan Sungai Kecil', description: 'Bendungan kecil untuk irigasi', location: 'Sungai Kecil', latitude: -0.842, longitude: 122.189, area: 55.0, waterLevel: 3.7, status: 'normal', canals: 1, gates: 2, waterSource: 'Sungai Kecil' },
    { name: 'Irigasi Delta', description: 'Irigasi daerah delta sungai', location: 'Delta', latitude: -0.801, longitude: 122.445, area: 125.0, waterLevel: 4.3, status: 'normal', canals: 3, gates: 5, waterSource: 'Sungai Delta' },
    { name: 'Saluran Induk Timur', description: 'Saluran induk wilayah timur', location: 'Timur', latitude: -0.875, longitude: 122.512, area: 175.0, waterLevel: 5.5, status: 'high', canals: 4, gates: 9, waterSource: 'Sungai Timur' },
  ];

  for (const profile of profiles) {
    await prisma.irrigationProfile.create({
      data: profile,
    });
    console.log(`Seeded irrigation profile: ${profile.name} - ${profile.location}`);
  }

  console.log('✅ Irrigation profiles seeding completed.');
}

async function main() {
  console.log('Starting comprehensive database seeding...\n');
  
  try {
    await seedPermissions();
    console.log('');
    
    await seedRolesAndUsers();
    console.log('');
    
    await seedCategories();
    console.log('');

    await seedEmployees();
    console.log('');
    await seedIrrigationProfiles();
    console.log('');
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Super Admin: su.admin@irigasibunta.com / Buntamengalir25!');
    console.log('Admin: admin@buntabella.go.id / admin123');
    console.log('\n🔐 Both accounts have full access to all system features.');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });