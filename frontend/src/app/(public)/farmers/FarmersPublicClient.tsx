'use client';

import React, { useState, useEffect } from 'react';
import { Farmer } from '@/types/farmer';

export default function FarmersPublicClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [farmerData, setFarmerData] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const fetchFarmerData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/data/farmers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFarmerData(data);
      } else {
        setError('Gagal mengambil data kelompok tani');
      }
    } catch {
      setError('Error mengambil data kelompok tani');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const filteredData = farmerData.filter(farmer =>
    farmer.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.chairman.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Data Kelompok Tani</h1>
          <p className="text-gray-600 mt-2">Informasi kelompok tani CIKASDA PSDA Wilayah II</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama kelompok, ketua, atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kelompok tani'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((farmer) => (
              <div key={farmer.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{farmer.group}</h3>
                  <p className="text-gray-600 text-sm">Kelompok Tani</p>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Nama: </span>
                    <span className="text-gray-600">{farmer.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ketua: </span>
                    <span className="text-gray-600">{farmer.chairman}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Jumlah Anggota: </span>
                    <span className="text-gray-600">{farmer.members.length} orang</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Anggota: </span>
                    <span className="text-gray-600 text-sm">{farmer.members.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistical summary */}
        {filteredData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Statistik</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                <div className="text-sm text-gray-600">Kelompok Tani</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredData.reduce((sum, farmer) => sum + farmer.members.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Anggota</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredData.length}
                </div>
                <div className="text-sm text-gray-600">Total Kelompok</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(filteredData.reduce((sum, farmer) => sum + farmer.members.length, 0) / filteredData.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Rata-rata Anggota</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}