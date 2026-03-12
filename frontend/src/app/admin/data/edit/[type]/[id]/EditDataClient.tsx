'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WaterLevelRainfallItem {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CropDataItem {
  id: string;
  crop: string;
  area: number;
  production: number;
  season: string;
  location: string | null;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface EditDataClientProps {
  type: string;
  id: string;
}

export default function EditDataClient({ type, id }: EditDataClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    location: '',
    value: '',
    unit: '',
    measuredAt: '',
    crop: '',
    area: '',
    production: '',
    season: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [type, id]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const apiUrl = type === 'water-level'
        ? `/api/admin/data/water-level`
        : type === 'rainfall'
        ? `/api/admin/data/rainfall`
        : `/api/admin/data/crops`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (type === 'crop') {
          const data: CropDataItem[] = await response.json();
          const item = data.find((d) => d.id === id);
          
          if (item) {
            setFormData({
              location: item.location || '',
              value: '',
              unit: '',
              measuredAt: '',
              crop: item.crop,
              area: item.area.toString(),
              production: item.production.toString(),
              season: item.season,
            });
          } else {
            setError('Data tidak ditemukan');
          }
        } else {
          const data: WaterLevelRainfallItem[] = await response.json();
          const item = data.find((d) => d.id === id);
          
          if (item) {
            setFormData({
              location: item.location,
              value: item.value.toString(),
              unit: item.unit,
              measuredAt: item.measuredAt.slice(0, 16), // Format for datetime-local input
              crop: '',
              area: '',
              production: '',
              season: '',
            });
          } else {
            setError('Data tidak ditemukan');
          }
        }
      } else {
        setError('Gagal mengambil data');
      }
    } catch (err) {
      setError('Error mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = type === 'water-level'
        ? '/api/admin/data/water-level'
        : type === 'rainfall'
        ? '/api/admin/data/rainfall'
        : '/api/admin/data/crops';

      let requestBody;
      if (type === 'crop') {
        requestBody = {
          id,
          crop: formData.crop,
          area: formData.area,
          production: formData.production,
          season: formData.season,
          location: formData.location || null,
        };
      } else {
        requestBody = {
          id,
          location: formData.location,
          value: formData.value,
          unit: formData.unit,
          measuredAt: formData.measuredAt,
        };
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSuccess('Data berhasil diperbarui');
        setTimeout(() => {
          router.push('/admin/data/management');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memperbarui data');
      }
    } catch (err) {
      setError('Error memperbarui data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Data {type === 'water-level' ? 'Ketinggian Air' : type === 'rainfall' ? 'Curah Hujan' : 'Tanaman'}
          </h1>
          <p className="text-gray-600 mt-2">Perbarui data {type === 'crop' ? 'tanaman' : 'pengukuran'}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'crop' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanaman
                  </label>
                  <input
                    type="text"
                    name="crop"
                    required
                    value={formData.crop}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama tanaman"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Luas Area (Ha)
                  </label>
                  <input
                    type="number"
                    name="area"
                    required
                    step="0.01"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Masukkan luas area dalam hektar"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produksi (Ton)
                  </label>
                  <input
                    type="number"
                    name="production"
                    required
                    step="0.01"
                    value={formData.production}
                    onChange={handleInputChange}
                    placeholder="Masukkan produksi dalam ton"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Musim
                  </label>
                  <input
                    type="text"
                    name="season"
                    required
                    value={formData.season}
                    onChange={handleInputChange}
                    placeholder="Masukkan musim tanam"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi (Opsional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Masukkan lokasi tanam"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lokasi"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nilai
                  </label>
                  <input
                    type="number"
                    name="value"
                    required
                    step="0.01"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder={type === 'water-level' ? 'Masukkan ketinggian air dalam cm' : 'Masukkan curah hujan dalam mm'}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder={type === 'water-level' ? 'cm (default)' : 'mm (default)'}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Kosongkan untuk menggunakan satuan default ({type === 'water-level' ? 'cm' : 'mm'})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Pengukuran
                  </label>
                  <input
                    type="datetime-local"
                    name="measuredAt"
                    required
                    value={formData.measuredAt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white cursor-pointer py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Memperbarui...' : 'Perbarui Data'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/data/management')}
                className="bg-gray-600 text-white cursor-pointer py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}