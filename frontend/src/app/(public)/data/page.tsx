'use client';

import { useState, useEffect, useMemo } from 'react';
import WaterLevelChart from '@/components/charts/WaterLevelChart';
import RainfallChart from '@/components/charts/RainfallChart';
import { WaterLevelData as ChartWaterLevelData, RainfallData as ChartRainfallData } from '@/types/data';
import { Search, ChevronDown, Check, BarChart3, CloudRain, Sprout, Users, Droplets, ChartBar } from 'lucide-react';

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

const tabConfig = [
  { id: 'water', label: 'Level Air', icon: Droplets, color: 'blue' },
  { id: 'rainfall', label: 'Curah Hujan', icon: CloudRain, color: 'cyan' },
  { id: 'crops', label: 'Data Tanaman', icon: Sprout, color: 'green' },
  { id: 'farmers', label: 'Data Petani', icon: Users, color: 'orange' },
];

const quickStats = [
  { icon: Droplets, label: 'Level Air', color: 'blue' },
  { icon: CloudRain, label: 'Curah Hujan', color: 'green' },
  { icon: Sprout, label: 'Area Tanam', color: 'orange' },
  { icon: ChartBar, label: 'Produksi', color: 'purple' },
];

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
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'water': return <WaterLevelChart data={chartWaterData} />;
      case 'rainfall': return <RainfallChart data={chartRainfallData} />;
      case 'crops':
        return (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tanaman</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Area (ha)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Produksi (ton)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hasil (ton/ha)</th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((crop, index) => (
                  <tr key={crop.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{crop.crop}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{crop.area?.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{crop.production?.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(crop.production / crop.area).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'farmers':
        return (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama Kelompok</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ketua</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Anggota</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {farmerData.map((farmer, index) => (
                  <tr key={farmer.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{farmer.group}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{farmer.chairman}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{farmer.members?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(farmer.createdAt).toLocaleDateString('id-ID')}</td>
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjLTEuMSAwLTItLjktMi0ydi00YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00em0wLTIwaC00Yy0xLjEgMC0yLS45LTItMnYtNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMnoiLz48cGF0aCBkPSJNMjAgMzRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTR6bTAtMTBoLTRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>Data & Statistik</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Data & Statistik
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Daerah Irigrasi 
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Akses data irigasi komprehensif dan metrik produksi. Pantau
              perkembangan terkini melalui visualisasi data yang interaktif.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{stat.label}</h3>
              </div>
            ))}
          </div>

          {/* Main Data Visualization Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ChartBar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Visualisasi Data</h2>
                    <p className="text-sm text-gray-500">Data diperbarui secara berkala</p>
                  </div>
                </div>
                <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-medium">
                  Menampilkan: {selectedLocation?.name}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* --- DROPDOWN SEARCH --- */}
              <div className="relative mb-6">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-left shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-800 font-medium">{selectedLocation?.name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                    <div className="sticky top-0 p-3 bg-white border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Cari lokasi..."
                          className="w-full pl-9 pr-4 py-2.5 text-black text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer text-sm hover:bg-blue-50 transition-colors ${
                              selectedLocationId === loc.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div>
                              <div className={`font-medium ${selectedLocationId === loc.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                {loc.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">{loc.description}</div>
                            </div>
                            {selectedLocationId === loc.id && (
                              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-6 text-center text-sm text-gray-500">Lokasi tidak ditemukan</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {isDropdownOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />}

              {/* Tabs */}
              <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
                {tabConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content Area */}
              <div className="min-h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">{error}</div>
                ) : (
                  renderTabContent()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
