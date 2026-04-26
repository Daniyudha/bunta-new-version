'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Pencil, Trash2, MapPin, Droplets, Tractor, Eye, Building2, ChevronDown, ChevronUp, FileImage, Upload } from 'lucide-react';

interface IrrigationProfile {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  area: number;
  waterLevel: number | null;
  status: string;
  canals: number | null;
  gates: number | null;
  waterSource: string | null;
  regency: string | null;
  constructionYear: number | null;
  servedVillages: string | null;
  potentialArea: number | null;
  functionalArea: number | null;
  dischargeCapacity: number | null;
  channelLength: number | null;
  watershedArea: number | null;
  productivity: string | null;
  totalStructures: number | null;
  mainStructure: string | null;
  divisionStructure: number | null;
  intakeStructure: number | null;
  dropStructure: number | null;
  aqueduct: number | null;
  drainageCulvert: number | null;
  roadCulvert: number | null;
  slopingDrain: number | null;
  buildingScheme?: string | null;
  networkScheme?: string | null;
  rttg?: string | null;
  plantingSchedule?: string | null;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

const imageFields = [
  { key: 'buildingScheme', label: 'BUILDING SCHEME (Jpg)' },
  { key: 'networkScheme', label: 'NETWORK SCHEME (Jpg)' },
  { key: 'rttg', label: 'RTTG (Jpg)' },
  { key: 'plantingSchedule', label: 'PLANTING SCHEDULE (Jpg)' },
] as const;

const statusColors: Record<string, string> = {
  normal: 'bg-green-100 text-green-800',
  low: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  normal: 'Normal',
  low: 'Rendah',
  high: 'Tinggi',
  critical: 'Kritis',
};

export default function IrrigationProfilesManagementClient() {
  const { status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<IrrigationProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch profiles when debounced search query or page changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfiles(currentPage, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, currentPage, status]);

  const fetchProfiles = useCallback(async (page = currentPage, query = debouncedSearchQuery) => {
    try {
      setError('');
      const url = new URL('/api/admin/irrigation-profiles', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', itemsPerPage.toString());
      if (query) {
        url.searchParams.append('search', query);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.total || 0);
      } else {
        const errorData = await response.json();
        setError(`Gagal mengambil data profil irigasi: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching irrigation profiles:', error);
      setError(`Error mengambil data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, itemsPerPage]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus profil irigasi ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/irrigation-profiles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProfiles(profiles.filter(profile => profile.id !== id));
        fetchProfiles(currentPage, debouncedSearchQuery);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Gagal menghapus profil irigasi');
      }
    } catch (error) {
      alert('Error menghapus profil irigasi');
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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, profileId: string, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    setUploadingImage(`${profileId}-${fieldKey}`);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/irrigation-profiles/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();

      // Update profile's image field via PUT
      const updateRes = await fetch(`/api/admin/irrigation-profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldKey]: result.url }),
      });
      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.message || 'Failed to update profile');
      }

      // Refresh list
      fetchProfiles(currentPage, debouncedSearchQuery);
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(null);
    }
  };

  if (status === 'loading' || loading) {
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
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Profil Irigasi</h1>
            <p className="text-gray-600 mt-2">Kelola data profil irigasi untuk sistem irigasi Anda</p>
          </div>
          <Link
            href="/admin/irrigation-profiles/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Tambah Profil Baru
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Search Section */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Menampilkan {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} sampai {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} hasil
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
                    placeholder="Cari profil irigasi..."
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

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama / Lokasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kabupaten
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area (ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sumber Air
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <React.Fragment key={profile.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                      {profile.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.regency || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.area.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.waterSource || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[profile.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[profile.status] || profile.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleExpand(profile.id)}
                        className="inline-flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer"
                        title="Lihat Detail"
                      >
                        {expandedId === profile.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                      <Link
                        href={`/admin/irrigation-profiles/edit/${profile.id}`}
                        className="inline-flex items-center justify-center p-2 rounded text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="inline-flex items-center justify-center p-2 rounded text-red-600 hover:bg-red-100 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Detail Row */}
                  {expandedId === profile.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-blue-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Detail Profil Section */}
                          <div className="col-span-full">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <Eye size={16} className="text-blue-600" />
                              Detail Profil
                            </h4>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Deskripsi</span>
                            <p className="text-sm font-medium text-gray-900">{profile.description || '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Tahun Pembuatan</span>
                            <p className="text-sm font-medium text-gray-900">{profile.constructionYear || '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Desa Layanan</span>
                            <p className="text-sm font-medium text-gray-900">{profile.servedVillages || '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Area Potensial</span>
                            <p className="text-sm font-medium text-gray-900">{profile.potentialArea ? `${profile.potentialArea} ha` : '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Area Fungsional</span>
                            <p className="text-sm font-medium text-gray-900">{profile.functionalArea ? `${profile.functionalArea} ha` : '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Debit Andalan</span>
                            <p className="text-sm font-medium text-gray-900">{profile.dischargeCapacity ? `${profile.dischargeCapacity} m³/dtk` : '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Panjang Saluran</span>
                            <p className="text-sm font-medium text-gray-900">{profile.channelLength ? `${profile.channelLength} km` : '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Luas DAS</span>
                            <p className="text-sm font-medium text-gray-900">{profile.watershedArea ? `${profile.watershedArea} ha` : '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Produktivitas</span>
                            <p className="text-sm font-medium text-gray-900">{profile.productivity || '-'}</p>
                          </div>

                          {/* Infrastruktur Bangunan Section */}
                          <div className="col-span-full mt-4">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <Building2 size={16} className="text-blue-600" />
                              Infrastruktur Bangunan
                            </h4>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Total Bangunan</span>
                            <p className="text-sm font-medium text-gray-900">{profile.totalStructures ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Bendung</span>
                            <p className="text-sm font-medium text-gray-900">{profile.mainStructure || '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Bangunan Bagi</span>
                            <p className="text-sm font-medium text-gray-900">{profile.divisionStructure ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Bangunan Muka</span>
                            <p className="text-sm font-medium text-gray-900">{profile.intakeStructure ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Bangunan Terjun</span>
                            <p className="text-sm font-medium text-gray-900">{profile.dropStructure ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Talang</span>
                            <p className="text-sm font-medium text-gray-900">{profile.aqueduct ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Gorong Pembuang</span>
                            <p className="text-sm font-medium text-gray-900">{profile.drainageCulvert ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Gorong Jalan</span>
                            <p className="text-sm font-medium text-gray-900">{profile.roadCulvert ?? '-'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <span className="text-xs text-gray-500">Got Miring</span>
                            <p className="text-sm font-medium text-gray-900">{profile.slopingDrain ?? '-'}</p>
                          </div>

                          {/* Gambar & Dokumen Section */}
                          <div className="col-span-full mt-4">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <FileImage size={16} className="text-amber-600" />
                              Gambar & Dokumen
                            </h4>
                          </div>
                          {imageFields.map(field => {
                            const imgUrl = profile[field.key as keyof IrrigationProfile] as string | undefined;
                            const isUploading = uploadingImage === `${profile.id}-${field.key}`;
                            return (
                              <div key={field.key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 col-span-full md:col-span-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-500 font-medium">{field.label}</span>
                                  <label className={`cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                    {isUploading ? (
                                      <span className="flex items-center gap-1">
                                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Upload...
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <Upload size={12} />
                                        Upload
                                      </span>
                                    )}
                                    <input type="file" accept="image/jpeg,image/jpg,image/png" className="hidden" disabled={isUploading}
                                      onChange={(e) => handleImageUpload(e, profile.id, field.key)} />
                                  </label>
                                </div>
                                {imgUrl ? (
                                  <div className="relative w-full h-28 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                                    <Image src={imgUrl} alt={field.label} fill className="object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-full h-28 rounded-md border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <p className="text-xs text-gray-400">Belum ada</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

          {profiles.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada profil irigasi ditemukan. <Link href="/admin/irrigation-profiles/create" className="text-blue-600 hover:underline">Buat profil irigasi pertama Anda</Link>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
