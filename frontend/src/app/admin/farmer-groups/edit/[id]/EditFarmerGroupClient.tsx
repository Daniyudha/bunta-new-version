'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UpdateFarmerInput } from '@/types/farmer';

interface EditFarmerGroupClientProps {
  id: string;
}

export default function EditFarmerGroupClient({ id }: EditFarmerGroupClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<UpdateFarmerInput>({
    name: '',
    group: '',
    chairman: '',
    members: [],
    userId: '',
  });
  const [memberInput, setMemberInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchFarmerData();
  }, [id]);

  const fetchFarmerData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/farmers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name,
          group: data.group,
          chairman: data.chairman,
          members: data.members || [],
          userId: data.userId || '',
        });
      } else {
        setError('Gagal mengambil data kelompok tani');
      }
    } catch (err) {
      setError('Error mengambil data kelompok tani');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setFormData(prev => ({
        ...prev,
        members: [...(prev.members || []), memberInput.trim()],
      }));
      setMemberInput('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: (prev.members || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/farmers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Data kelompok tani berhasil diperbarui');
        setTimeout(() => {
          router.push('/admin/farmer-groups');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Gagal memperbarui kelompok tani');
      }
    } catch (err) {
      setError('Error memperbarui kelompok tani');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ubah Kelompok Tani</h1>
          <p className="text-gray-600 mt-2">Perbarui data kelompok tani</p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Form Ubah Kelompok Tani
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelompok *
                </label>
                <input
                  type="text"
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Masukkan nama kelompok"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ketua Kelompok *
              </label>
              <input
                type="text"
                name="chairman"
                value={formData.chairman}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Masukkan nama ketua kelompok"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anggota Kelompok *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Masukkan nama anggota"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Tambah
                </button>
              </div>

              {formData.members && formData.members.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Daftar Anggota:</h4>
                  <ul className="space-y-1">
                    {formData.members?.map((member, index) => (
                      <li key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                        <span className="text-gray-800">{member}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Hapus
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Link
                href="/admin/farmer-groups"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting || !formData.members || formData.members.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Memperbarui...' : 'Perbarui'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}