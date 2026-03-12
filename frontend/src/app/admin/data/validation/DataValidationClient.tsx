'use client';

import { useState, useEffect } from 'react';

interface ValidationStats {
  totalEntries: number;
  validatedEntries: number;
  pendingValidation: number;
  invalidEntries: number;
}

export default function DataValidationClient() {
  const [stats, setStats] = useState<ValidationStats>({
    totalEntries: 0,
    validatedEntries: 0,
    pendingValidation: 0,
    invalidEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDataType, setSelectedDataType] = useState('all');

  useEffect(() => {
    fetchValidationStats();
  }, []);

  const fetchValidationStats = async () => {
    try {
      setLoading(true);
      // Fetch counts from different data tables
      const [rainfallCount, waterLevelCount, cropCount, farmerCount] = await Promise.all([
        fetch('/api/data/rainfall/count').then(res => res.json()).catch(() => ({ count: 0 })),
        fetch('/api/data/water-level/count').then(res => res.json()).catch(() => ({ count: 0 })),
        fetch('/api/data/crop/count').then(res => res.json()).catch(() => ({ count: 0 })),
        fetch('/api/data/farmers/count').then(res => res.json()).catch(() => ({ count: 0 }))
      ]);

      const totalEntries = rainfallCount.count + waterLevelCount.count + cropCount.count + farmerCount.count;
      
      // For now, set placeholder values for validation status
      setStats({
        totalEntries,
        validatedEntries: Math.floor(totalEntries * 0.7), // 70% validated
        pendingValidation: Math.floor(totalEntries * 0.2), // 20% pending
        invalidEntries: Math.floor(totalEntries * 0.1) // 10% invalid
      });
    } catch (error) {
      console.error('Error fetching validation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAllData = async () => {
    try {
      const response = await fetch('/api/data/validate-all', {
        method: 'POST'
      });
      if (response.ok) {
        alert('Data validation process started successfully!');
        fetchValidationStats();
      } else {
        alert('Failed to start validation process');
      }
    } catch (error) {
      console.error('Error validating data:', error);
      alert('Error starting validation process');
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Validasi Data</h1>
        <p className="text-gray-600 mt-2">Kelola dan validasi data sistem irigasi</p>
      </div>

      {/* Validation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
              <div className="text-sm text-gray-600">Total Entri</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.validatedEntries}</div>
              <div className="text-sm text-gray-600">Tervalidasi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingValidation}</div>
              <div className="text-sm text-gray-600">Menunggu Validasi</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">❌</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.invalidEntries}</div>
              <div className="text-sm text-gray-600">Tidak Valid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Type Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter Data</h2>
        <select
          value={selectedDataType}
          onChange={(e) => setSelectedDataType(e.target.value)}
          className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Semua Tipe Data</option>
          <option value="rainfall">Data Curah Hujan</option>
          <option value="water-level">Data Ketinggian Air</option>
          <option value="crop">Data Tanaman</option>
          <option value="farmer">Data Petani</option>
        </select>
      </div>

      {/* Validation Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Aksi Validasi</h2>
        <div className="space-y-4">
          <button
            onClick={validateAllData}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Validasi Semua Data
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
              Validasi Data Terpilih
            </button>
            <button className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
              Hapus Data Tidak Valid
            </button>
          </div>
        </div>
      </div>

      {/* Validation Log */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Validasi</h2>
        <div className="text-gray-500 text-center py-8">
          <p>Fitur log validasi akan segera tersedia</p>
          <p className="text-sm mt-2">Log akan menampilkan riwayat validasi data</p>
        </div>
      </div>
    </div>
  );
}