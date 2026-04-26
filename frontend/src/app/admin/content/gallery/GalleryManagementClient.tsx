'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { galleryCategories } from '@/types/gallery';
import { Search, X, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  type: string;
  active: boolean;
  createdAt: string;
  date: string;
}

export default function GalleryManagementClient() {
  const { status } = useSession();
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchGallery();
    }
  }, [status, router]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchGallery = useCallback(async (page = currentPage, query = debouncedSearchQuery, category = selectedCategory) => {
    try {
      setError('');
      const url = new URL('/api/admin/gallery', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (query) {
        url.searchParams.append('search', query);
      }
      if (category && category !== 'All') {
        url.searchParams.append('category', category);
      }

      console.log('Fetching gallery from:', url.toString());
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        console.log('Gallery API response:', data);
        setGallery(data.data || []);
        setFilteredGallery(data.data || []); // Keep for backward compatibility, but server handles filtering
        setTotalPages(data.pagination?.pages || 1);
        setTotalItems(data.pagination?.total || 0);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Gagal mengambil data item galeri');
        console.error('API error:', errorData);
      }
    } catch (error) {
      setError('Error jaringan: Tidak dapat mengambil data item galeri');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, selectedCategory, itemsPerPage]);

  // Fetch gallery when debounced search query, page, or category changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchGallery(currentPage, debouncedSearchQuery, selectedCategory);
    }
  }, [debouncedSearchQuery, currentPage, status, selectedCategory, fetchGallery]);


  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item galeri ini?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update both gallery and filteredGallery states immediately
        setGallery(prevGallery => prevGallery.filter(item => item.id !== id));
        setFilteredGallery(prevFiltered => prevFiltered.filter(item => item.id !== id));
        // Also update total items count
        setTotalItems(prevTotal => prevTotal - 1);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Gagal menghapus item galeri');
      }
    } catch (error) {
      setError('Error jaringan: Tidak dapat menghapus item galeri');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !active }),
      });

      if (response.ok) {
        fetchGallery(); // Refresh the list
      } else {
        setError('Gagal memperbarui item galeri');
      }
    } catch (error) {
      setError('Error memperbarui item galeri');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Remove client-side filtering since it's now handled by the server
  // The filteredGallery state is set directly from the API response

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Galeri</h1>
            <p className="text-gray-600 mt-2">Kelola gambar dan video galeri</p>
          </div>
          <Link
            href="/admin/content/gallery/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Item Baru
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Category Filter and Search */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
                Filter berdasarkan Kategori:
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
              >
                {galleryCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} hasil
                {searchQuery && (
                  <span> untuk &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                )}
              </span>
            </div>
            
            {/* Search Form */}
            <div className="flex items-center">
              <div className="bg-white rounded-lg border border-gray-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari galeri berdasarkan judul..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full text-black pl-10 pr-12 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGallery.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap">
                    {item.type === 'video' ? (
                      <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 text-xl">🎬</span>
                      </div>
                    ) : item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-sm">📷</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleToggleActive(item.id, item.active)}
                      className={`inline-flex items-center justify-center p-2 rounded transition cursor-pointer ${
                        item.active
                          ? 'text-yellow-600 hover:bg-yellow-500/10'
                          : 'text-green-600 hover:bg-green-500/10'
                      }`}
                      title={item.active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {item.active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      href={`/admin/content/gallery/edit/${item.id}`}
                      className="inline-flex items-center justify-center p-2 rounded text-blue-600 hover:bg-blue-500/10 transition cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Halaman {currentPage} dari {totalPages}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-black cursor-pointer text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-md ${currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-black cursor-pointer text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

          {filteredGallery.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada item galeri ditemukan. Buat item pertama Anda!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}