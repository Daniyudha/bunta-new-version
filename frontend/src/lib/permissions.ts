// Permission mapping for sidebar navigation
export const permissionMap = {
  // Dashboard
  'dashboard:view': ['/admin/dashboard'],

  // Content Management
  'news:read': ['/admin/content/news'],
  'news:create': ['/admin/content/news'],
  'news:edit': ['/admin/content/news'],
  'news:delete': ['/admin/content/news'],
  'news:publish': ['/admin/content/news'],
  
  'gallery:read': ['/admin/content/gallery'],
  'gallery:create': ['/admin/content/gallery'],
  'gallery:edit': ['/admin/content/gallery'],
  'gallery:delete': ['/admin/content/gallery'],
  
  'categories:read': ['/admin/content/categories'],
  'categories:create': ['/admin/content/categories'],
  'categories:edit': ['/admin/content/categories'],
  'categories:delete': ['/admin/content/categories'],
  
  'sliders:read': ['/admin/content/sliders'],
  'sliders:create': ['/admin/content/sliders'],
  'sliders:edit': ['/admin/content/sliders'],
  'sliders:delete': ['/admin/content/sliders'],
  

  // Storage Management
  'storage:read': ['/admin/storage'],
  'storage:upload': ['/admin/storage'],
  'storage:edit': ['/admin/storage'],
  'storage:delete': ['/admin/storage'],

  // Data Management
  'data:read': ['/admin/data/management', '/admin/data/locations'],
  'data:create': ['/admin/data/management', '/admin/data/locations'],
  'data:edit': ['/admin/data/management', '/admin/data/locations'],
  'data:delete': ['/admin/data/management', '/admin/data/locations'],
  'data:export': ['/admin/data/management', '/admin/data/locations'],
  
  // Irrigation Data specific permissions
  'irrigation:read': ['/admin/data/irrigation'],
  'irrigation:create': ['/admin/data/irrigation'],
  'irrigation:edit': ['/admin/data/irrigation'],
  'irrigation:delete': ['/admin/data/irrigation'],

  // Farmer Group Management
  'farmer_groups:read': ['/admin/farmer-groups'],
  'farmer_groups:create': ['/admin/farmer-groups'],
  'farmer_groups:edit': ['/admin/farmer-groups'],
  'farmer_groups:delete': ['/admin/farmer-groups'],

  // Irrigation Profile Management Permissions
  'irrigation_profiles:read': ['/admin/irrigation-profiles'],
  'irrigation_profiles:create': ['/admin/irrigation-profiles'],
  'irrigation_profiles:edit': ['/admin/irrigation-profiles'],
  'irrigation_profiles:delete': ['/admin/irrigation-profiles'],

  // Employee Management Permissions
  'employees:read': ['/admin/employees'],
  'employees:create': ['/admin/employees'],
  'employees:edit': ['/admin/employees'],
  'employees:delete': ['/admin/employees'],

  // User Management
  'users:read': ['/admin/users'],
  'users:create': ['/admin/users'],
  'users:edit': ['/admin/users'],
  'users:delete': ['/admin/users'],
  'users:roles': ['/admin/users'],
  
  'roles:read': ['/admin/roles'],
  'roles:create': ['/admin/roles'],
  'roles:edit': ['/admin/roles'],
  'roles:delete': ['/admin/roles'],
  'roles:permissions': ['/admin/roles', '/admin/permissions'],

  // Contact Submissions Management
  'contact_submissions:read': ['/admin/contact-submissions'],
  'contact_submissions:edit': ['/admin/contact-submissions'],

  // Settings
  'settings:read': ['/admin/settings'],
  'settings:edit': ['/admin/settings'],

  // Reports
  'reports:view': ['/admin/reports'],
  'reports:generate': ['/admin/reports'],

  // Storage Management
  'storage:manage': ['/admin/storage']
};

// Function to check if user has access to a route
export const hasAccessToRoute = (userPermissions: string[], route: string): boolean => {
  // Super Admin always has access to everything
  if (userPermissions.includes('super-admin')) {
    return true;
  }

  // Check if any permission grants access to this route
  for (const [permission, routes] of Object.entries(permissionMap)) {
    if (userPermissions.includes(permission) && routes.includes(route)) {
      return true;
    }
  }

  return false;
};

// Function to get accessible sidebar items based on permissions
export const getAccessibleNavigation = (userPermissions: string[]) => {
  const accessibleNavigation = [
    {
      title: null,
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'CONTENT',
      items: [
        { name: 'Artikel Berita', href: '/admin/content/news', icon: 'Newspaper' },
        { name: 'Galeri', href: '/admin/content/gallery', icon: 'Images' },
        { name: 'Kategori', href: '/admin/content/categories', icon: 'Logs' },
        { name: 'Slider/Spanduk', href: '/admin/content/sliders', icon: 'GalleryThumbnails' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'Employee',
      items: [
        { name: 'Data Kepegawaian', href: '/admin/employees', icon: 'Database' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'DATA',
      items: [
        { name: 'Profil Irigasi', href: '/admin/irrigation-profiles', icon: 'Database' },
        { name: 'Data Irigasi', href: '/admin/data/irrigation', icon: 'Database' },
        { name: 'Manajemen Lokasi', href: '/admin/data/locations', icon: 'Database' },
        { name: 'Kelompok Tani', href: '/admin/farmer-groups', icon: 'Users' },
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'SUBMISSIONS',
      items: [
        { name: 'Pesan Masuk', href: '/admin/contact-submissions', icon: 'MessageCircle' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'STORAGE',
      items: [
        { name: 'Arsip Data', href: '/admin/storage', icon: 'Archive' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    },
    {
      title: 'MANAGEMENT USER',
      items: [
        { name: 'Pengguna', href: '/admin/users', icon: 'Users' },
        { name: 'Peran', href: '/admin/roles', icon: 'UserRoundCog' },
        { name: 'List Perijinan', href: '/admin/permissions', icon: 'ShieldCheck' }
      ].filter(item => hasAccessToRoute(userPermissions, item.href))
    }
  ];

  // Remove sections with no items
  return accessibleNavigation.filter(section => 
    section.items.length > 0 || !section.title
  );
};