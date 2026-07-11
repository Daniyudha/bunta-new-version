'use client';

import { useState, useEffect, useMemo } from 'react';
import WaterLevelChart from '@/components/charts/WaterLevelChart';
import RainfallChart from '@/components/charts/RainfallChart';
import { WaterLevelData as ChartWaterLevelData, RainfallData as ChartRainfallData } from '@/types/data';
import { Search, ChevronDown, Check, BarChart3, CloudRain, Sprout, Users, Droplets, ChartBar, Map, Image as ImageIcon, Table2, BadgeCheck, Briefcase, ShieldCheck, Building2, Gauge, Ruler, Layers } from 'lucide-react';
import Image from 'next/image';

interface DbWaterLevelData { id: string; location: string; value: number; unit: string; measuredAt: string; }
interface DbRainfallData { id: string; location: string; value: number; unit: string; measuredAt: string; }
interface DbCropData { id: string; crop: string; area: number; production: number; season: string; location: string | null; createdAt: string; }
interface DbFarmerData { id: string; name: string; group: string; chairman: string; members: string[]; createdAt: string; }
interface IrrigationProfileApi {
  id: string;
  name: string;
  description?: string;
  location?: string;
  area?: number;
  canals?: number | null;
  gates?: number | null;
  potentialArea?: number | null;
  functionalArea?: number | null;
  dischargeCapacity?: number | null;
  watershedArea?: number | null;
  totalStructures?: number | null;
  jumlahPetakTersier?: number | null;
  nilaiIksi?: number | null;
  primaryChannelLength?: number | null;
  secondaryChannelLength?: number | null;
  waterSource?: string | null;
  regency?: string | null;
  constructionYear?: number | null;
  servedVillages?: string | null;
  productivity?: string | null;
  mainStructure?: string | null;
  divisionStructure?: number | null;
  intakeStructure?: number | null;
  dropStructure?: number | null;
  aqueduct?: number | null;
  drainageCulvert?: number | null;
  roadCulvert?: number | null;
  slopingDrain?: number | null;
  buildingScheme?: string | null;
  networkScheme?: string | null;
  mainPhoto?: string | null;
  p3aGroupList?: any;
  farmingBusinessAnalysis?: any;
  rttg?: string | null;
  plantingSchedule?: string | null;
}
interface Employee { id: string; name: string; position: string; status: string; }

const tabConfig = [
  { id: 'water', label: 'Debit Andalan', icon: Droplets, color: 'blue' },
  { id: 'rainfall', label: 'Curah Hujan', icon: CloudRain, color: 'cyan' },
  { id: 'crops', label: 'Data Tanaman', icon: Sprout, color: 'green' },
  { id: 'farmers', label: 'Data Kelompok Tani', icon: Users, color: 'orange' },
  { id: 'irrigationData', label: 'Data Irigasi', icon: Map, color: 'indigo' },
];

const quickStats = [
  { icon: Droplets, label: 'Debit Andalan', color: 'blue' },
  { icon: CloudRain, label: 'Curah Hujan', color: 'cyan' },
  { icon: Sprout, label: 'Area Tanam', color: 'green' },
  { icon: ChartBar, label: 'Produksi', color: 'purple' },
  { icon: Users, label: 'Kelompok Tani', color: 'orange' },
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

  // State untuk data profil irigasi lengkap (rekapitulasi)
  const [profiles, setProfiles] = useState<IrrigationProfileApi[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  // State untuk data pegawai (rekapitulasi status kepegawaian)
  const [employees, setEmployees] = useState<Employee[]>([]);

  // State untuk data irigasi detail
  const [irrigationDetail, setIrrigationDetail] = useState<IrrigationProfileApi | null>(null);
  const [irrigationLoading, setIrrigationLoading] = useState(false);

  // State untuk Dropdown Search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('all');

  // Employee counts by status
  const employeePns = employees.filter(e => e.status === 'PNS').length;
  const employeePppkPenuh = employees.filter(e => e.status === 'PPPK Penuh Waktu').length;
  const employeePppkParuh = employees.filter(e => e.status === 'PPPK Paruh Waktu').length;
  const employeeKontrak = employees.filter(e => e.status === 'Kontrak/PHL').length;
  const totalEmployees = employees.length;

  // Fetch irrigation profiles (locations) on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setProfilesLoading(true);
        const response = await fetch('/api/irrigation-profiles?limit=100');
        if (response.ok) {
          const result = await response.json();
          const profileList: IrrigationProfileApi[] = result.profiles || [];
          setProfiles(profileList);
          const locationItems = [
            { id: 'all', name: 'Semua Lokasi', description: 'Menampilkan data gabungan' },
            ...profileList.map((profile) => ({
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
      } finally {
        setProfilesLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // ─── Aggregate computations for irrigation profiles ─────────────────────────
  const totalLocations = profiles.length;
  const totalArea = profiles.reduce((sum, p) => sum + (p.area || 0), 0);
  const totalCanals = profiles.reduce((sum, p) => sum + (p.canals || 0), 0);
  const totalGates = profiles.reduce((sum, p) => sum + (p.gates || 0), 0);
  const totalPotentialArea = profiles.reduce((sum, p) => sum + (p.potentialArea || 0), 0);
  const totalFunctionalArea = profiles.reduce((sum, p) => sum + (p.functionalArea || 0), 0);
  const totalPetakTersier = profiles.reduce((sum, p) => sum + (p.jumlahPetakTersier || 0), 0);
  const totalPrimaryChannel = profiles.reduce((sum, p) => sum + (p.primaryChannelLength || 0), 0);
  const totalSecondaryChannel = profiles.reduce((sum, p) => sum + (p.secondaryChannelLength || 0), 0);

  // Find max values for bar scaling
  const maxArea = Math.max(...profiles.map(p => p.area || 0), 1);
  const maxCanals = Math.max(...profiles.map(p => p.canals || 0), 1);
  const maxGates = Math.max(...profiles.map(p => p.gates || 0), 1);

  // Fetch employees for stats
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees?limit=200');
        if (response.ok) {
          const data = await response.json();
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  // Fetch irrigation detail when tab is irrigationData and a specific location is selected
  useEffect(() => {
    if (activeTab === 'irrigationData' && selectedLocationId !== 'all' && selectedLocation) {
      setIrrigationLoading(true);
      setIrrigationDetail(null);
      const fetchIrrigationDetail = async () => {
        try {
          const response = await fetch(`/api/irrigation-profiles/${selectedLocationId}`);
          if (response.ok) {
            const data = await response.json();
            setIrrigationDetail(data);
          }
        } catch (err) {
          console.error('Error fetching irrigation detail:', err);
        } finally {
          setIrrigationLoading(false);
        }
      };
      fetchIrrigationDetail();
    } else if (activeTab === 'irrigationData') {
      setIrrigationDetail(null);
      setIrrigationLoading(false);
    }
  }, [activeTab, selectedLocationId, selectedLocation]);

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
            const response = await fetch(`/api/data/crops${locationParam}`);
            if (response.ok) setCropData(await response.json());
        } else if (activeTab === 'farmers') {
            const response = await fetch(`/api/data/farmers${locationParam}`);
            if (response.ok) setFarmerData(await response.json());
        } else if (activeTab === 'irrigationData') {
          // Data is fetched separately above
          setLoading(false);
          return;
        }
      } catch {
        setError('Error mengambil data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, selectedLocationId, selectedLocation]);

  const renderIrrigationImages = () => {
    if (!irrigationDetail) return null;
    const imageFields = [
      { key: 'buildingScheme', label: 'Skema Bangunan' },
      { key: 'networkScheme', label: 'Skema Jaringan' },
      { key: 'rttg', label: 'RTTG' },
      { key: 'plantingSchedule', label: 'Jadwal Tanam' },
    ];

    const hasImages = imageFields.some(f => irrigationDetail[f.key as keyof IrrigationProfileApi]);

    if (!hasImages) {
      return (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Tidak ada gambar tersedia untuk lokasi ini</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageFields.map(field => {
          const value = irrigationDetail[field.key as keyof IrrigationProfileApi] as string | null;
          if (!value) return null;
          return (
            <div key={field.key} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{field.label}</h4>
              <div className="relative h-48 rounded-md overflow-hidden border border-gray-200 bg-white">
                <Image
                  src={value}
                  alt={field.label}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><p>Gambar tidak dapat dimuat</p></div>';
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderIrrigationTables = () => {
    if (!irrigationDetail) return null;

    const tableFields = [
      { key: 'p3aGroupList', label: 'P3A Group List' },
      { key: 'farmingBusinessAnalysis', label: 'Farming Business Analysis' },
    ];

    const hasTables = tableFields.some(f => {
      const data = irrigationDetail[f.key as keyof IrrigationProfileApi];
      return Array.isArray(data) && data.length > 0;
    });

    if (!hasTables) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Table2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Tidak ada data tabel tersedia untuk lokasi ini</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {tableFields.map(field => {
          const data = irrigationDetail[field.key as keyof IrrigationProfileApi];
          if (!Array.isArray(data) || data.length === 0) return null;
          const columns = Object.keys(data[0] || {});

          return (
            <div key={field.key}>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{field.label}</h4>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {columns.map(col => (
                          <td key={col} className="px-4 py-3 text-sm text-gray-700">{String(item[col] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
                    <td className="px-4 py-3 text-sm text-gray-600">
                    <ul className="list-decimal list-inside space-y-1">
                      {farmer.members?.map((member, index) => (
                        <li key={index} className="text-xs">{member}</li>
                      ))}
                    </ul>
                  </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(farmer.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'irrigationData':
        return (
          <div className="space-y-8">
            {selectedLocationId === 'all' ? (
              <div className="text-center py-12 text-gray-400">
                <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Pilih Lokasi Terlebih Dahulu</h3>
                <p className="text-sm">Silakan pilih lokasi spesifik dari dropdown di atas untuk melihat data irigasi detail</p>
              </div>
            ) : irrigationLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : irrigationDetail ? (
              <>
                {/* Section: Gambar */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-600" />
                    Gambar & Dokumen
                  </h3>
                  {renderIrrigationImages()}
                </div>

                {/* Section: Tabel */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-indigo-600" />
                    Data Tabel
                  </h3>
                  {renderIrrigationTables()}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Gagal memuat data irigasi</p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-800 text-white">
        {/* Background Pattern */}
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

          {/* Employee Stats Recap Section */}
          {totalEmployees > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Rekapitulasi Pegawai</h2>
                  <p className="text-sm text-gray-500">Total {totalEmployees} pegawai</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* PNS */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{employeePns}</p>
                      <p className="text-xs text-gray-500">PNS</p>
                    </div>
                  </div>
                </div>

                {/* PPPK Penuh Waktu */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{employeePppkPenuh}</p>
                      <p className="text-xs text-gray-500">PPPK Penuh Waktu</p>
                    </div>
                  </div>
                </div>

                {/* PPPK Paruh Waktu */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{employeePppkParuh}</p>
                      <p className="text-xs text-gray-500">PPPK Paruh Waktu</p>
                    </div>
                  </div>
                </div>

                {/* Kontrak/PHL */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{employeeKontrak}</p>
                      <p className="text-xs text-gray-500">Kontrak/PHL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rekapitulasi Profil Irigasi */}
          {!profilesLoading && profiles.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Rekapitulasi Profil Irigasi</h2>
                  <p className="text-sm text-gray-500">Ringkasan data dari {totalLocations} lokasi irigasi</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-700">{totalLocations}</p>
                      <p className="text-xs text-blue-600">Total Lokasi</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-700">{totalArea.toLocaleString()} Ha</p>
                      <p className="text-xs text-emerald-600">Total Luas Area</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-amber-700">{totalCanals}</p>
                      <p className="text-xs text-amber-600">Total Saluran</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-indigo-700">{totalGates}</p>
                      <p className="text-xs text-indigo-600">Total Pintu Air</p>
                    </div>
                  </div>
                </div>
                {totalPetakTersier > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-purple-700">{totalPetakTersier}</p>
                        <p className="text-xs text-purple-600">Petak Tersier</p>
                      </div>
                    </div>
                  </div>
                )}
                {totalPrimaryChannel > 0 && (
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Ruler className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-cyan-700">{(totalPrimaryChannel + totalSecondaryChannel).toFixed(1)} km</p>
                        <p className="text-xs text-cyan-600">Panjang Saluran</p>
                      </div>
                    </div>
                  </div>
                )}
                {totalPotentialArea > 0 && (
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-teal-700">{totalFunctionalArea.toLocaleString()} Ha</p>
                        <p className="text-xs text-teal-600">Area Fungsional</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Bar Chart: Perbandingan per Lokasi */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Perbandingan Antar Lokasi
                </h3>
                <div className="space-y-3">
                  {profiles.map((profile) => {
                    const areaWidth = maxArea > 0 ? ((profile.area || 0) / maxArea) * 100 : 0;
                    const canalsWidth = maxCanals > 0 ? ((profile.canals || 0) / maxCanals) * 100 : 0;
                    const gatesWidth = maxGates > 0 ? ((profile.gates || 0) / maxGates) * 100 : 0;
                    return (
                      <div key={profile.id} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{profile.name}</span>
                          <span className="text-xs text-gray-400">{profile.area || 0} Ha</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          {/* Area bar */}
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${areaWidth}%` }}
                            />
                          </div>
                          {/* Canals bar */}
                          {(profile.canals || 0) > 0 && (
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${canalsWidth}%` }}
                              />
                            </div>
                          )}
                          {/* Gates bar */}
                          {(profile.gates || 0) > 0 && (
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${gatesWidth}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-blue-500 flex-1">Luas</span>
                          {(profile.canals || 0) > 0 && <span className="text-[10px] text-amber-500 flex-1">Saluran</span>}
                          {(profile.gates || 0) > 0 && <span className="text-[10px] text-indigo-500 flex-1">Pintu Air</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabel Perbandingan Lokasi */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-gray-500" />
                    Detail Data Profil Irigasi
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lokasi</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Luas (Ha)</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Saluran</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Pintu Air</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Area Potensial</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Area Fungsional</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Petak Tersier</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Saluran Primer (km)</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Saluran Sekunder (km)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map((profile, idx) => (
                        <tr key={profile.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/50 transition-colors`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{profile.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.area || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.canals ?? '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.gates ?? '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.potentialArea ?? '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.functionalArea ?? '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.jumlahPetakTersier ?? '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.primaryChannelLength ? profile.primaryChannelLength.toFixed(2) : '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right whitespace-nowrap">{profile.secondaryChannelLength ? profile.secondaryChannelLength.toFixed(2) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Main Data Visualization Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
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
                {loading && activeTab !== 'irrigationData' ? (
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
