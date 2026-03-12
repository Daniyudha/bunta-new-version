'use client';

import { useState, useEffect } from 'react';
import IrrigationMap from '@/components/maps/IrrigationMap';
import { IrrigationArea } from '@/types/irrigation';
import Select from 'react-select';
import Image from 'next/image';

interface IrrigationProfileApi {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  area: number;
  waterLevel: number | null;
  status: string; // 'normal' | 'low' | 'high' | 'critical'
  canals: number | null;
  gates: number | null;
  waterSource: string | null;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export default function IrrigationPage() {
  const [, setSelectedArea] = useState<IrrigationArea | null>(null);
  const [allProfiles, setAllProfiles] = useState<IrrigationArea[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<IrrigationArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  // Fetch all profiles once
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/irrigation-profiles?limit=100');
        if (!response.ok) {
          throw new Error('Gagal mengambil data profil irigasi');
        }

        const data = await response.json();
        const profilesData: IrrigationProfileApi[] = data.profiles || [];

        // Transform to IrrigationArea
        const transformed: IrrigationArea[] = profilesData.map(profile => ({
          id: profile.id,
          name: profile.name,
          description: profile.description || '',
          coordinates: profile.latitude && profile.longitude
            ? [profile.latitude, profile.longitude]
            : [-0.9136959956309897, 122.29245556083764], // fallback to Bunta coordinates
          area: profile.area,
          waterLevel: profile.waterLevel || 0,
          status: (profile.status === 'normal' || profile.status === 'low' || profile.status === 'high' || profile.status === 'critical')
            ? profile.status
            : 'normal',
          lastUpdate: profile.lastUpdate,
          canals: profile.canals || 0,
          gates: profile.gates || 0,
        }));

        setAllProfiles(transformed);
        setFilteredProfiles(transformed);
      } catch (err) {
        console.error('Error fetching irrigation profiles:', err);
        setError('Error mengambil data profil irigasi. Menampilkan data statis sebagai cadangan.');
        setAllProfiles([]);
        setFilteredProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfiles();
  }, []);


  // Update filtered profiles when selection changes
  useEffect(() => {
    if (selectedProfileId === '') {
      setFilteredProfiles(allProfiles);
    } else {
      const selected = allProfiles.find(p => p.id === selectedProfileId);
      setFilteredProfiles(selected ? [selected] : []);
    }
  }, [selectedProfileId, allProfiles]);



  const handleAreaSelect = (area: IrrigationArea) => {
    setSelectedArea(area);
  };

  const getStatusColor = (status: IrrigationArea['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: IrrigationArea['status']) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Air Rendah';
      case 'high': return 'Air Tinggi';
      case 'critical': return 'Kritis';
      default: return 'Tidak Diketahui';
    }
  };


  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profil Irigasi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi jaringan irigasi wilayah Bunta dengan informasi detail dan peta interaktif.
          </p>
        </div>

        {/* Interactive Map Section - Always show all profiles */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Peta Interaktif</h2>
            <p className="text-gray-600 mb-6">
              Klik pada penanda untuk melihat informasi detail tentang setiap area irigasi.
            </p>
            <IrrigationMap areas={allProfiles.length > 0 ? allProfiles : []} onAreaSelect={handleAreaSelect} />
          </div>
        </div>

        {/* Filter Section - Searchable Dropdown */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Cari Profil Irigasi</h2>
          <div className="w-full text-black">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih profil irigasi dari dropdown</label>
            <Select
              options={allProfiles.map(profile => ({ value: profile.id, label: profile.name }))}
              value={selectedProfileId ? { value: selectedProfileId, label: allProfiles.find(p => p.id === selectedProfileId)?.name || '' } : null}
              onChange={(selectedOption) => setSelectedProfileId(selectedOption ? selectedOption.value : '')}
              placeholder="Pilih profil irigasi..."
              isSearchable={true}
              isClearable={true}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <div className="mt-2 text-sm text-gray-500">
              {selectedProfileId === ''
                ? `Menampilkan semua ${allProfiles.length} profil irigasi.`
                : `Menampilkan 1 profil terpilih.`}
            </div>
          </div>
        </div>

        {/* Filtered Areas Overview */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Memuat data...</span>
            </div>
          ) : error ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-semibold">Peringatan</p>
              <p>{error}</p>
              <p className="text-sm mt-1">Menampilkan data statis sebagai cadangan.</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data profil irigasi yang sesuai dengan filter.
            </div>
          ) : (
            filteredProfiles.map((area) => (
              <div key={area.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                {/* Judul & Status Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-700">{area.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{area.description}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-center ${getStatusColor(area.status)}`}>
                    {getStatusText(area.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Kolom Kiri: Gambar */}
                  <div className="lg:col-span-1">
                    <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200">
                      <Image
                        src={`/images/sample-img.jpeg`}
                        alt={area.name}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Kolom Kanan: Grid Informasi Data */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                      {/* Item Statistik */}
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-blue-600 uppercase mb-1">Level Air</span>
                        <span className="text-xl font-extrabold text-gray-800">{area.waterLevel} <small className="font-normal text-sm">m</small></span>
                      </div>

                      <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-green-600 uppercase mb-1">Luas Area</span>
                        <span className="text-xl font-extrabold text-gray-800">{area.area.toLocaleString()} <small className="font-normal text-sm">ha</small></span>
                      </div>

                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-orange-600 uppercase mb-1">Saluran</span>
                        <span className="text-xl font-extrabold text-gray-800">{area.canals} <small className="font-normal text-sm">km</small></span>
                      </div>

                      <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-purple-600 uppercase mb-1">Pintu Air</span>
                        <span className="text-xl font-extrabold text-gray-800">{area.gates} <small className="font-normal text-sm">unit</small></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}