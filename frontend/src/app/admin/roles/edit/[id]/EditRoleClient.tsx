'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Permission, Role } from '@prisma/client';

interface PermissionWithSelected extends Permission {
  selected: boolean;
}

interface RoleWithPermissions extends Role {
  permissions: {
    permission: Permission;
  }[];
}

interface EditRoleClientProps {
  roleId: string;
}

export default function EditRoleClient({ roleId }: EditRoleClientProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [permissions, setPermissions] = useState<PermissionWithSelected[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch role details
        const roleResponse = await fetch(`/api/admin/roles/${roleId}`);
        if (!roleResponse.ok) {
          throw new Error('Failed to fetch role details');
        }
        const roleData: RoleWithPermissions = await roleResponse.json();
        
        setName(roleData.name);
        setDescription(roleData.description || '');
        setIsDefault(roleData.isDefault);

        // Fetch all permissions
        const permissionsResponse = await fetch('/api/admin/permissions');
        if (!permissionsResponse.ok) {
          throw new Error('Failed to fetch permissions');
        }
        const allPermissions: Permission[] = await permissionsResponse.json();

        // Mark which permissions are selected for this role
        const rolePermissionIds = new Set(roleData.permissions.map(p => p.permission.id));
        setPermissions(
          allPermissions.map(perm => ({
            ...perm,
            selected: rolePermissionIds.has(perm.id)
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev =>
      prev.map(perm =>
        perm.id === permissionId
          ? { ...perm, selected: !perm.selected }
          : perm
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const selectedPermissionIds = permissions
        .filter(perm => perm.selected)
        .map(perm => perm.id);

      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          isDefault,
          permissionIds: selectedPermissionIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      router.push('/admin/roles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/admin/roles"
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Back to Roles
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Role</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Role Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter role name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 text-black block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter role description"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Set as default role for new users</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {permission.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={permission.selected}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/admin/roles"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update Role'}
          </button>
        </div>
      </form>
    </div>
  );
}