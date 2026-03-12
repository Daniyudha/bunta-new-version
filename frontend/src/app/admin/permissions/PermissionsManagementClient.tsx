'use client';

import { useState, useEffect } from 'react';
import { Permission } from '@prisma/client';

export default function PermissionsManagementClient() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/permissions');
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data izin');
        }
        
        const data = await response.json();
        setPermissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manajemen Izin</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
          <div key={category} className="border-b border-gray-200 last:border-b-0">
            <div className="bg-gray-50 px-6 py-3">
              <h2 className="text-lg font-medium text-gray-900">{category}</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPermissions.map((permission) => (
                  <div key={permission.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {permission.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {permission.description || 'Tidak ada deskripsi tersedia'}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      ID: {permission.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Total izin: {permissions.length}</p>
        <p>Izin dikelola secara otomatis oleh sistem dan tidak dapat dimodifikasi melalui antarmuka.</p>
      </div>
    </div>
  );
}