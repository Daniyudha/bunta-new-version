const { PrismaClient } = require('@prisma/client');

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
];

async function main() {
  console.log('Seeding system permissions...');

  // Create permissions if they don't exist
  for (const permissionData of permissions) {
    // Check if permission already exists by name
    const existingPermission = await prisma.permission.findFirst({
      where: { name: permissionData.name }
    });

    if (existingPermission) {
      // Update existing permission
      const permission = await prisma.permission.update({
        where: { id: existingPermission.id },
        data: {
          description: permissionData.description,
          category: permissionData.category,
        },
      });
      console.log(`Updated permission: ${permission.name}`);
    } else {
      // Create new permission
      const permission = await prisma.permission.create({
        data: permissionData,
      });
      console.log(`Created permission: ${permission.name}`);
    }
  }

  console.log('Permissions seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });