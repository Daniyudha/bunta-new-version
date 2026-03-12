'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface Employee {
  id: string;
  name: string;
  position: string;
  education: string | null;
  status: string;
  photo: string | null;
  department: string | null;
  age: number | null;
  workRegion: string | null;
  order: number | null;
}

export default function EditEmployee() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    education: '',
    status: 'PNS',
    photo: '',
    department: '',
    age: '',
    workRegion: '',
    order: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchEmployee();
    }
  }, [status, params.id]);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/admin/employees/${params.id}`);
      if (response.ok) {
        const employeeData = await response.json();
        setEmployee(employeeData);
        setFormData({
          name: employeeData.name,
          position: employeeData.position,
          education: employeeData.education || '',
          status: employeeData.status,
          photo: employeeData.photo || '',
          department: employeeData.department || '',
          age: employeeData.age?.toString() || '',
          workRegion: employeeData.workRegion || '',
          order: employeeData.order?.toString() || '',
        });
      } else {
        setError('Gagal mengambil data pegawai');
      }
    } catch (err) {
      setError('Error mengambil data pegawai');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        position: formData.position,
        education: formData.education || null,
        status: formData.status,
        photo: formData.photo || null,
        department: formData.department || null,
        age: formData.age ? parseInt(formData.age) : null,
        workRegion: formData.workRegion || null,
        order: formData.order ? parseInt(formData.order) : null,
      };

      const response = await fetch(`/api/admin/employees/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/employees');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal memperbarui pegawai');
      }
    } catch (error) {
      setError('Error memperbarui pegawai');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Pegawai tidak ditemukan.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Data Pegawai</h1>
          <p className="text-gray-600 mt-2">Ubah data pegawai.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama pegawai"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Posisi / Jabatan *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Staf Keuangan"
              />
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: S1 Teknik"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status Kepegawaian *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PNS">PNS</option>
                <option value="Honorer">Honorer</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Magang">Magang</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Departemen / Bagian
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Keuangan"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Umur
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 30"
              />
            </div>

            <div>
              <label htmlFor="workRegion" className="block text-sm font-medium text-gray-700 mb-2">
                Wilayah Kerja
              </label>
              <input
                type="text"
                id="workRegion"
                name="workRegion"
                value={formData.workRegion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Jawa Barat"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Tampilan
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Foto (URL)
              </label>
              <input
                type="text"
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Masukkan URL gambar atau path ke file upload.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/employees')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}