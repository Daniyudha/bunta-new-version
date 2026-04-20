'use client';

import { useState, useEffect, ReactNode } from 'react';
import IrrigationMap from '@/components/maps/IrrigationMap';
import Select from 'react-select';
import Image from 'next/image';

// ================= TYPES =================
export interface IrrigationArea {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  area: number;
  waterLevel: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  lastUpdate: string;
  canals: number;
  gates: number;

  // extended profile
  regency?: string;
  constructionYear?: number;
  servedVillages?: string;
  potentialArea?: number;
  functionalArea?: number;
  dischargeCapacity?: number;
  channelLength?: number;
  watershedArea?: number;
  productivity?: string;
  totalStructures?: number;
  mainStructure?: string;
  divisionStructure?: number;
  intakeStructure?: number;
  dropStructure?: number;
  aqueduct?: number;
  drainageCulvert?: number;
  roadCulvert?: number;
  slopingDrain?: number;
}

interface IrrigationProfileApi {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  area: number;
  waterLevel: number | null;
  status: string;
  canals: number | null;
  gates: number | null;
  lastUpdate: string;
}

// ================= FALLBACK DATA =================
const fallbackDetail: Record<string, Partial<IrrigationArea>> = {
  '1': {
    regency: 'Kabupaten Banggai',
    constructionYear: 2005,
    servedVillages: 'Desa A, Desa B, Desa C',
    potentialArea: 1200,
    functionalArea: 950,
    dischargeCapacity: 2.5,
    channelLength: 15,
    watershedArea: 3000,
    productivity: 'Padi 5 ton/ha',
    totalStructures: 25,
    mainStructure: 'Bendung Beton',
    divisionStructure: 5,
    intakeStructure: 3,
    dropStructure: 4,
    aqueduct: 2,
    drainageCulvert: 6,
    roadCulvert: 3,
    slopingDrain: 2,
  }
};

export default function IrrigationPage() {
  const [allProfiles, setAllProfiles] = useState<IrrigationArea[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<IrrigationArea[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/irrigation-profiles?limit=100');
        const data = await res.json();

        const transformed: IrrigationArea[] = (data.profiles || []).map((p: IrrigationProfileApi) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          coordinates: p.latitude && p.longitude ? [p.latitude, p.longitude] : [0, 0],
          area: p.area || 0,
          waterLevel: p.waterLevel || 0,
          status: (['normal','low','high','critical'].includes(p.status) ? p.status : 'normal') as 'normal' | 'low' | 'high' | 'critical',
          lastUpdate: p.lastUpdate,
          canals: p.canals || 0,
          gates: p.gates || 0,
          ...fallbackDetail[p.id]
        }));

        setAllProfiles(transformed);
        setFilteredProfiles(transformed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedProfileId) return setFilteredProfiles(allProfiles);
    const found = allProfiles.find(p => p.id === selectedProfileId);
    setFilteredProfiles(found ? [found] : []);
  }, [selectedProfileId, allProfiles]);

  const getStatusColor = (status: IrrigationArea['status']) => {
    return {
      normal: 'bg-green-100 text-green-700',
      low: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    }[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profil Irigasi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi jaringan irigasi wilayah Bunta dengan informasi detail dan peta interaktif.
          </p>
        </div>

        {/* MAP */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Peta Interaktif</h2>
          <p className="text-gray-600 mb-6">
            Klik pada penanda untuk melihat informasi detail tentang setiap area irigasi.
          </p>
          <IrrigationMap areas={allProfiles} onAreaSelect={()=>{}} />
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

        {/* CONTENT */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredProfiles.map(area => (
            <div key={area.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">

              {/* HEADER CARD */}
              <div className="p-6 flex justify-between items-center border-b">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">{area.name}</h2>
                  <p className="text-sm text-gray-500">{area.regency}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(area.status)}`}>
                  {area.status}
                </span>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 p-6">

                {/* IMAGE */}
                <Image src="/images/sample-img.jpeg" alt="img" width={400} height={300} className="rounded-xl object-cover" />

                {/* MAIN STATS */}
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Level Air" value={`${area.waterLevel} m`} />
                  <Stat label="Luas" value={`${area.area} ha`} />
                  <Stat label="Saluran" value={`${area.canals} km`} />
                  <Stat label="Pintu" value={`${area.gates}`} />
                </div>

                {/* PROFILE DETAIL */}
                <div className="space-y-2 text-sm">
                  <Detail label="Tahun" value={area.constructionYear} />
                  <Detail label="Desa" value={area.servedVillages} />
                  <Detail label="Potensial" value={area.potentialArea} />
                  <Detail label="Fungsional" value={area.functionalArea} />
                  <Detail label="Debit" value={area.dischargeCapacity} />
                  <Detail label="Panjang" value={area.channelLength} />
                  <Detail label="DAS" value={area.watershedArea} />
                  <Detail label="Produktivitas" value={area.productivity} />
                </div>
              </div>

              {/* STRUCTURES */}
              <div className="grid md:grid-cols-3 gap-x-10 p-6 bg-blue-50">
                <Detail label="Total Bangunan" value={area.totalStructures} />
                <Detail label="Bendung" value={area.mainStructure} />
                <Detail label="Bagi" value={area.divisionStructure} />
                <Detail label="Muka" value={area.intakeStructure} />
                <Detail label="Terjun" value={area.dropStructure} />
                <Detail label="Talang" value={area.aqueduct} />
                <Detail label="Gorong Pembuang" value={area.drainageCulvert} />
                <Detail label="Gorong Jalan" value={area.roadCulvert} />
                <Detail label="Got Miring" value={area.slopingDrain} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ================= SMALL COMPONENTS =================
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center text-center h-full">
      <p className="text-sm text-blue-800">{label}</p>
      <p className="font-bold text-lg text-black">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between border-b border-b-gray-200 pb-1">
      <span className="text-black">{label}</span>
      <span className="text-black font-medium">{value || '-'}</span>
    </div>
  );
}
