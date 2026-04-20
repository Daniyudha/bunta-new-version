'use client';

import { useState, useEffect, useMemo } from 'react';
import WaterLevelChart from '@/components/charts/WaterLevelChart';
import RainfallChart from '@/components/charts/RainfallChart';
import { WaterLevelData as ChartWaterLevelData, RainfallData as ChartRainfallData } from '@/types/data';
import { Search, ChevronDown, Check } from 'lucide-react'; // Pastikan sudah install lucide-react

// ... Interface tetap sama seperti kode Anda ...
interface DbWaterLevelData { id: string; location: string; value: number; unit: string; measuredAt: string; }
interface DbRainfallData { id: string; location: string; value: number; unit: string; measuredAt: string; }
interface DbCropData { id: string; crop: string; area: number; production: number; season: string; location: string | null; createdAt: string; }
interface DbFarmerData { id: string; name: string; group: string; chairman: string; members: string[]; createdAt: string; }
interface IrrigationProfileApi {
  id: string;
  name: string;
  description?: string;
  location?: string;
}

export default function DataPage() {
  const [activeTab, setActiveTab] = useState('water');
  const [chartWaterData, setChartWaterData] = useState<ChartWaterLevelData[]>([]);
  const [chartRainfallData, setChartRainfallData] = useState<ChartRainfallData[]>([]);
  const [cropData, setCropData] = useState<DbCropData[]>([]);
  const [farmerData, setFarmerData] = useState<DbFarmerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState<{ id: string; name: string; description: string; location?: string }[]>([]);

  // State untuk Dropdown Search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('all');

  // Fetch irrigation profiles (locations) on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/irrigation-profiles?limit=100');
        if (response.ok) {
          const result = await response.json();
          const profiles = result.profiles || [];
          // Transform to location items
          const locationItems = [
            { id: 'all', name: 'Semua Lokasi', description: 'Menampilkan data gabungan' },
            ...profiles.map((profile: IrrigationProfileApi) => ({
              id: profile.id,
              name: profile.name,
              description: profile.description || profile.location || '',
              location: profile.location,
            })),
          ];
          setLocations(locationItems);
        } else {
          console.error('Failed to fetch irrigation profiles');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  // Filter Lokasi Statis
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Build location query param
        const locationParam = selectedLocationId !== 'all' && selectedLocation
          ? `?location=${encodeURIComponent(selectedLocation.name)}`
          : '';
        
        if (activeTab === 'water') {
          const response = await fetch(`/api/data/water-level${locationParam}`);
          if (response.ok) {
            const data: DbWaterLevelData[] = await response.json();
            const transformedData: ChartWaterLevelData[] = data.map(item => ({
              date: item.measuredAt?.split('T')[0] || new Date().toISOString().split('T')[0],
              level: Number(item.value) || 0,
              area: item.location || 'Lokasi Tidak Diketahui'
            }));
            setChartWaterData(transformedData);
          } else { setError('Gagal mengambil data level air'); }
        } else if (activeTab === 'rainfall') {
          const response = await fetch(`/api/data/rainfall${locationParam}`);
          if (response.ok) {
            const data: DbRainfallData[] = await response.json();
            const transformedData: ChartRainfallData[] = data.map(item => ({
              date: item.measuredAt?.split('T')[0] || new Date().toISOString().split('T')[0],
              rainfall: Number(item.value) || 0,
              area: item.location || 'Lokasi Tidak Diketahui'
            }));
            setChartRainfallData(transformedData);
          } else { setError('Gagal mengambil data curah hujan'); }
        } else if (activeTab === 'crops') {
            const response = await fetch('/api/data/crops');
            if (response.ok) setCropData(await response.json());
        } else if (activeTab === 'farmers') {
            const response = await fetch('/api/data/farmers');
            if (response.ok) setFarmerData(await response.json());
        }
      } catch {
        setError('Error mengambil data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, selectedLocationId, selectedLocation]);

  const tabs = [
    { id: 'water', label: 'Level Air', icon: '💧' },
    { id: 'rainfall', label: 'Curah Hujan', icon: '🌧️' },
    { id: 'crops', label: 'Data Tanaman', icon: '🌾' },
    { id: 'farmers', label: 'Data Kelompok Petani', icon: '👨‍🌾' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'water': return <WaterLevelChart data={chartWaterData} />;
      case 'rainfall': return <RainfallChart data={chartRainfallData} />;
      case 'crops':
        return (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50 text-black">
                  <th className="px-4 py-2 text-left font-semibold">Tanaman</th>
                  <th className="px-4 py-2 text-left font-semibold">Area (ha)</th>
                  <th className="px-4 py-2 text-left font-semibold">Produksi (ton)</th>
                  <th className="px-4 py-2 text-left font-semibold">Hasil (ton/ha)</th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((crop, index) => (
                  <tr key={crop.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-black">{crop.crop}</td>
                    <td className="px-4 py-2 text-black">{crop.area?.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-black">{crop.production?.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-black">{(crop.production / crop.area).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'farmers':
        return (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50 text-black">
                  <th className="px-4 py-2 text-left font-semibold">Nama Kelompok</th>
                  <th className="px-4 py-2 text-left font-semibold">Ketua</th>
                  <th className="px-4 py-2 text-left font-semibold">Anggota</th>
                  <th className="px-4 py-2 text-left font-semibold">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {farmerData.map((farmer, index) => (
                  <tr key={farmer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-black">{farmer.group}</td>
                    <td className="px-4 py-2 text-black">{farmer.chairman}</td>
                    <td className="px-4 py-2 text-black">{farmer.members?.length || 0}</td>
                    <td className="px-4 py-2 text-black">{new Date(farmer.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Data & Statistik</h1>
          <p className="text-xl text-gray-600">Akses data irigasi komprehensif dan metrik produksi.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-b-4 border-blue-500">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">💧</div>
            <h3 className="text-lg font-semibold text-black">Level Air</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-b-4 border-green-500">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🌧️</div>
            <h3 className="text-lg font-semibold text-black">Curah Hujan</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-b-4 border-orange-500">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🌾</div>
            <h3 className="text-lg font-semibold text-black">Area Tanam</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center border-b-4 border-purple-500">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">📊</div>
            <h3 className="text-lg font-semibold text-black">Produksi</h3>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Visualisasi Data</h2>
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium italic">
              Menampilkan data untuk: {selectedLocation?.name}
            </div>
          </div>

          {/* --- DROPDOWN SEARCH STATIC --- */}
          <div className="relative mb-4">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <span className="block truncate text-gray-800 font-medium">
                {selectedLocation?.name}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="sticky top-0 p-2 bg-white border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari lokasi..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <li
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm hover:bg-blue-50 ${
                          selectedLocationId === loc.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
                        }`}
                      >
                        <div>
                          <div>{loc.name}</div>
                          <div className="text-xs text-gray-400">{loc.description}</div>
                        </div>
                        {selectedLocationId === loc.id && <Check className="w-4 h-4 text-blue-600" />}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 text-center text-sm text-gray-500">Lokasi tidak ditemukan</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* Overlay untuk menutup dropdown */}
          {isDropdownOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />}
          
          <div className="flex flex-wrap border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-80 pb-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}