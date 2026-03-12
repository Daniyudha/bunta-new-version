'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { Farmer } from '@/types/farmer';

interface WaterLevelData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface RainfallData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CropData {
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

type DataType = 'water-level' | 'rainfall' | 'crop' | 'farmer' | 'all';

type CombinedData =
  | (WaterLevelData & { type: 'water-level' })
  | (RainfallData & { type: 'rainfall' })
  | (CropData & { type: 'crop' })
  | (Farmer & { type: 'farmer' });

export default function DataManagementClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dataType, setDataType] = useState<DataType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waterLevelData, setWaterLevelData] = useState<WaterLevelData[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [farmerData, setFarmerData] = useState<Farmer[]>([]);
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [dataType]);

  useEffect(() => {
    // Ensure import modal is hidden when component mounts
    const modal = document.getElementById('importModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      if (dataType === 'all') {
        // Fetch all data types concurrently
        const [waterLevelResponse, rainfallResponse, cropResponse, farmerResponse] = await Promise.all([
          fetch('/api/admin/data/water-level', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/admin/data/rainfall', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/admin/data/crops', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('/api/admin/farmers', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        if (!waterLevelResponse.ok || !rainfallResponse.ok || !cropResponse.ok || !farmerResponse.ok) {
          setError('Failed to fetch some data');
          return;
        }

        const [waterLevelData, rainfallData, cropData, farmerResponseData] = await Promise.all([
          waterLevelResponse.json(),
          rainfallResponse.json(),
          cropResponse.json(),
          farmerResponse.json(),
        ]);

        // Extract farmer data from the response structure { data: Farmer[], pagination: {...} }
        const farmerData = farmerResponseData.data || [];

        // Combine all data with type information
        const combined: CombinedData[] = [
          ...waterLevelData.map((item: WaterLevelData) => ({ ...item, type: 'water-level' as const })),
          ...rainfallData.map((item: RainfallData) => ({ ...item, type: 'rainfall' as const })),
          ...cropData.map((item: CropData) => ({ ...item, type: 'crop' as const })),
          ...farmerData.map((item: Farmer) => ({ ...item, type: 'farmer' as const })),
        ];

        // Sort by createdAt descending
        combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setCombinedData(combined);
      } else {
        let apiUrl = '';
        switch (dataType) {
          case 'water-level':
            apiUrl = '/api/admin/data/water-level';
            break;
          case 'rainfall':
            apiUrl = '/api/admin/data/rainfall';
            break;
          case 'crop':
            apiUrl = '/api/admin/data/crops';
            break;
          case 'farmer':
            apiUrl = '/api/admin/farmers';
            break;
          default:
            throw new Error('Invalid data type');
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          switch (dataType) {
            case 'water-level':
              setWaterLevelData(data);
              break;
            case 'rainfall':
              setRainfallData(data);
              break;
            case 'crop':
              setCropData(data);
              break;
            case 'farmer':
              // Farmers API returns { data: Farmer[], pagination: {...} }
              setFarmerData(data.data || []);
              break;
          }
        } else {
          setError('Failed to fetch data');
        }
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, itemType?: DataType) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      let apiUrl = '';
      const typeToUse = itemType || dataType;
      
      switch (typeToUse) {
        case 'water-level':
          apiUrl = `/api/admin/data/water-level?id=${id}`;
          break;
        case 'rainfall':
          apiUrl = `/api/admin/data/rainfall?id=${id}`;
          break;
        case 'crop':
          apiUrl = `/api/admin/data/crops?id=${id}`;
          break;
        case 'farmer':
          apiUrl = `/api/admin/farmers?id=${id}`;
          break;
        default:
          throw new Error('Invalid data type');
      }

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh the data
        fetchData();
      } else {
        setError('Failed to delete data');
      }
    } catch (err) {
      setError('Error deleting data');
    }
  };

  const formatDateTime = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    let worksheetData = [];
    let filename = '';

    switch (dataType) {
      case 'water-level':
        worksheetData = [
          ['Lokasi', 'Nilai', 'Unit', 'Waktu Pengukuran'],
          ...waterLevelData.map(item => [
            item.location,
            item.value,
            item.unit,
            formatDateTime(item.measuredAt)
          ])
        ];
        filename = 'data_ketinggian_air.xlsx';
        break;
      case 'rainfall':
        worksheetData = [
          ['Lokasi', 'Nilai', 'Unit', 'Waktu Pengukuran'],
          ...rainfallData.map(item => [
            item.location,
            item.value,
            item.unit,
            formatDateTime(item.measuredAt)
          ])
        ];
        filename = 'data_curah_hujan.xlsx';
        break;
      case 'crop':
        worksheetData = [
          ['Tanaman', 'Luas (Ha)', 'Produksi (Ton)', 'Musim', 'Lokasi'],
          ...cropData.map(item => [
            item.crop,
            item.area,
            item.production,
            item.season,
            item.location || '-'
          ])
        ];
        filename = 'data_tanaman.xlsx';
        break;
      case 'farmer':
        worksheetData = [
          ['Nama Kelompok', 'Ketua', 'Jumlah Anggota', 'Tanggal Dibentuk'],
          ...farmerData.map(item => [
            item.group,
            item.chairman,
            item.members ? item.members.length : 0,
            formatDateTime(item.createdAt.toString())
          ])
        ];
        filename = 'data_kelompok_tani.xlsx';
        break;
      case 'all':
        worksheetData = [
          ['Tipe Data', 'Informasi', 'Nilai/Detail', 'Waktu Pencatatan'],
          ...combinedData.map(item => {
            if (item.type === 'water-level') {
              return [
                'Ketinggian Air',
                `Lokasi: ${item.location}`,
                `${item.value} ${item.unit}`,
                formatDateTime(item.createdAt)
              ];
            } else if (item.type === 'rainfall') {
              return [
                'Curah Hujan',
                `Lokasi: ${item.location}`,
                `${item.value} ${item.unit}`,
                formatDateTime(item.createdAt)
              ];
            } else if (item.type === 'crop') {
              return [
                'Tanaman',
                `Tanaman: ${item.crop}`,
                `Luas: ${item.area} Ha, Produksi: ${item.production} Ton`,
                formatDateTime(item.createdAt)
              ];
            } else if (item.type === 'farmer') {
              return [
                'Kelompok Tani',
                `Kelompok: ${item.group}`,
                `Ketua: ${item.chairman}, Anggota: ${item.members ? item.members.length : 0}`,
                formatDateTime(item.createdAt.toString())
              ];
            } else {
              // This should not happen, but for safety
              return ['Unknown', '', '', ''];
            }
          })
        ];
        filename = 'semua_data.xlsx';
        break;
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download file
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('importFile') as File;
    
    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Data berhasil diimpor');
      fetchData();
      const modal = document.getElementById('importModal');
      if (modal) {
        modal.classList.add('hidden');
      }
    } catch (err) {
      setError('Gagal mengimpor data');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    let worksheetData = [];
    let filename = '';

    switch (dataType) {
      case 'water-level':
        worksheetData = [
          ['Lokasi', 'Nilai', 'Unit', 'Waktu Pengukuran'],
          ['Lokasi 1', 100, 'cm', '2024-01-01T12:00:00Z']
        ];
        filename = 'template_ketinggian_air.xlsx';
        break;
      case 'rainfall':
        worksheetData = [
          ['Lokasi', 'Nilai', 'Unit', 'Waktu Pengukuran'],
          ['Lokasi 1', 50, 'mm', '2024-01-01T12:00:00Z']
        ];
        filename = 'template_curah_hujan.xlsx';
        break;
      case 'crop':
        worksheetData = [
          ['Tanaman', 'Luas (Ha)', 'Produksi (Ton)', 'Musim', 'Lokasi'],
          ['Padi', 10, 50, 'Musim Hujan', 'Lokasi 1']
        ];
        filename = 'template_tanaman.xlsx';
        break;
      case 'farmer':
        worksheetData = [
          ['Nama Kelompok', 'Ketua', 'Anggota (JSON array)'],
          ['Kelompok Tani Maju', 'Budi Santoso', '["Anggota 1", "Anggota 2"]']
        ];
        filename = 'template_kelompok_tani.xlsx';
        break;
      default:
        worksheetData = [['Tipe Data tidak didukung untuk template']];
        filename = 'template.xlsx';
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download file
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentData =
    dataType === 'water-level' ? waterLevelData :
    dataType === 'rainfall' ? rainfallData :
    dataType === 'crop' ? cropData :
    dataType === 'farmer' ? farmerData :
    combinedData;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Data</h1>
          <p className="text-gray-600 mt-2">Kelola data ketinggian air dan curah hujan</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Data
          </label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="w-full md:w-64 px-3 py-2 bg-white text-black border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Semua Data</option>
            <option value="water-level">Data Ketinggian Air (TMA)</option>
            <option value="rainfall">Data Curah Hujan</option>
            <option value="crop">Data Tanaman</option>
            <option value="farmer">Data Kelompok Tani</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {dataType === 'water-level' ? 'Data Ketinggian Air' :
                 dataType === 'rainfall' ? 'Data Curah Hujan' :
                 dataType === 'crop' ? 'Data Tanaman' :
                 dataType === 'farmer' ? 'Data Kelompok Tani' :
                 'Semua Data'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExport()}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Ekspor Data
                </button>
                <button
                  onClick={() => {
                    const modal = document.getElementById('importModal');
                    if (modal) {
                      modal.classList.remove('hidden');
                    }
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Impor Data
                </button>
                <Link
                  href="/admin/data/input"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Tambah Data
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Memuat data...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Tidak ada data yang ditemukan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {dataType === 'all' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipe Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Informasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nilai/Detail
                        </th>
                      </>
                    )}
                    {(dataType === 'water-level' || dataType === 'rainfall') && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nilai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu Pengukuran
                        </th>
                      </>
                    )}
                    {dataType === 'crop' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanaman
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Luas (Ha)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produksi (Ton)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Musim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokasi
                        </th>
                      </>
                    )}
                    {dataType === 'farmer' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Kelompok
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ketua
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah Anggota
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anggota
                        </th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dicatat Pada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item) => (
                    <tr key={item.id}>
                      {dataType === 'all' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CombinedData).type === 'water-level' ? 'Ketinggian Air' :
                             (item as CombinedData).type === 'rainfall' ? 'Curah Hujan' :
                             (item as CombinedData).type === 'crop' ? 'Tanaman' : 'Kelompok Tani'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CombinedData).type === 'water-level' && `Lokasi: ${(item as WaterLevelData).location}`}
                            {(item as CombinedData).type === 'rainfall' && `Lokasi: ${(item as RainfallData).location}`}
                            {(item as CombinedData).type === 'crop' && `Tanaman: ${(item as CropData).crop}`}
                            {(item as CombinedData).type === 'farmer' && `Kelompok: ${(item as Farmer).group}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CombinedData).type === 'water-level' && `${(item as WaterLevelData).value} ${(item as WaterLevelData).unit}`}
                            {(item as CombinedData).type === 'rainfall' && `${(item as RainfallData).value} ${(item as RainfallData).unit}`}
                            {(item as CombinedData).type === 'crop' && `Luas: ${(item as CropData).area} Ha, Produksi: ${(item as CropData).production} Ton`}
                            {(item as CombinedData).type === 'farmer' && `Ketua: ${(item as Farmer).chairman}, Anggota: ${(item as Farmer).members ? (item as Farmer).members.length : 0}`}
                          </td>
                        </>
                      )}
                      {(dataType === 'water-level' || dataType === 'rainfall') && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as WaterLevelData | RainfallData).location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as WaterLevelData | RainfallData).value} {(item as WaterLevelData | RainfallData).unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime((item as WaterLevelData | RainfallData).measuredAt)}
                          </td>
                        </>
                      )}
                      {dataType === 'crop' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CropData).crop}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CropData).area} Ha
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CropData).production} Ton
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CropData).season}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as CropData).location || '-'}
                          </td>
                        </>
                      )}
                      {dataType === 'farmer' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as Farmer).group}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as Farmer).chairman}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as Farmer).members ? (item as Farmer).members.length : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(item as Farmer).members ? (item as Farmer).members.join(', ') : 'Tidak ada anggota'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={dataType === 'all'
                            ? (item as CombinedData).type === 'farmer'
                              ? `/admin/farmer-groups/edit/${item.id}`
                              : `/admin/data/edit/${(item as CombinedData).type}/${item.id}`
                            : dataType === 'farmer'
                              ? `/admin/farmer-groups/edit/${item.id}`
                              : `/admin/data/edit/${dataType}/${item.id}`
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Ubah
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, dataType === 'all' ? (item as CombinedData).type : undefined)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <div id="importModal" className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 top-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Impor Data</h3>
              <button
                onClick={() => {
                  const modal = document.getElementById('importModal');
                  if (modal) {
                    modal.classList.add('hidden');
                  }
                }}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Pilih file XLSX untuk mengimpor data</p>
            
            <form onSubmit={handleImport}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File CSV
                </label>
                <input
                  type="file"
                  name="importFile"
                  accept=".xlsx"
                  className="w-full text-black border border-gray-300 file:py-2 file:px-4 file:bg-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => downloadTemplate()}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium cursor-pointer"
                >
                  Download Template
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengimpor...
                    </span>
                  ) : 'Impor Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}