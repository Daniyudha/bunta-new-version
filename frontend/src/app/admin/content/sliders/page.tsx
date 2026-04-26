'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface Slider {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  buttonText: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function SlidersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user is authenticated and has admin or super admin role
    if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    fetchSliders();
  }, [session, status, router]);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sliders');
      if (!response.ok) {
        throw new Error('Failed to fetch sliders');
      }
      const data = await response.json();
      setSliders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus slider ini?')) return;

    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete slider');
      }

      setSliders(sliders.filter(slider => slider.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete slider');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update slider');
      }

      const updatedSlider = await response.json();
      setSliders(sliders.map(slider => 
        slider.id === id ? updatedSlider : slider
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update slider');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Slider</h1>
        <Link
          href="/admin/content/sliders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Tambah Slider Baru
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gambar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Urutan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sliders.map((slider) => (
              <tr key={slider.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="h-16 w-24 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {slider.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {slider.subtitle || 'Tidak ada subjudul'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {slider.link ? (
                    <a
                      href={slider.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Lihat URL
                    </a>
                  ) : (
                    'Tidak ada tautan'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {slider.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(slider.id, slider.active)}
                    className={`inline-flex items-center justify-center p-2 rounded transition cursor-pointer ${
                      slider.active
                        ? 'text-yellow-600 hover:bg-yellow-500/10'
                        : 'text-green-600 hover:bg-green-500/10'
                    } cursor-pointer`}
                    title={slider.active ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {slider.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/content/sliders/edit/${slider.id}`}
                    className="inline-flex items-center justify-center p-2 rounded text-blue-600 hover:bg-blue-500/10 transition cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="inline-flex items-center justify-center p-2 rounded text-red-600 hover:bg-red-500/10 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sliders.length === 0 && !loading && (
          <div className="px-6 py-4 text-center text-gray-500">
            Tidak ada slider ditemukan. Buat slider pertama Anda untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}