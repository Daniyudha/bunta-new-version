"use client";

import { useState, useEffect } from "react";
import IrrigationMap from "@/components/maps/IrrigationMap";
import Select from "react-select";
import Image from "next/image";
import {
  MapPin,
  Droplets,
  Ruler,
  LayoutGrid,
  DoorOpen,
  Search,
  Waves,
} from "lucide-react";

// ================= TYPES =================
export interface IrrigationArea {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  area: number;
  waterLevel: number;
  status: "normal" | "low" | "high" | "critical";
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
  "1": {
    regency: "Kabupaten Banggai",
    constructionYear: 2005,
    servedVillages: "Desa A, Desa B, Desa C",
    potentialArea: 1200,
    functionalArea: 950,
    dischargeCapacity: 2.5,
    channelLength: 15,
    watershedArea: 3000,
    productivity: "Padi 5 ton/ha",
    totalStructures: 25,
    mainStructure: "Bendung Beton",
    divisionStructure: 5,
    intakeStructure: 3,
    dropStructure: 4,
    aqueduct: 2,
    drainageCulvert: 6,
    roadCulvert: 3,
    slopingDrain: 2,
  },
};

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  normal: {
    label: "Normal",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  low: {
    label: "Rendah",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  high: {
    label: "Tinggi",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  critical: {
    label: "Kritis",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

export default function IrrigationPage() {
  const [allProfiles, setAllProfiles] = useState<IrrigationArea[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<IrrigationArea[]>(
    [],
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/irrigation-profiles?limit=100");
        const data = await res.json();

        const transformed: IrrigationArea[] = (data.profiles || []).map(
          (p: IrrigationProfileApi) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            coordinates:
              p.latitude && p.longitude ? [p.latitude, p.longitude] : [0, 0],
            area: p.area || 0,
            waterLevel: p.waterLevel || 0,
            status: (["normal", "low", "high", "critical"].includes(p.status)
              ? p.status
              : "normal") as "normal" | "low" | "high" | "critical",
            lastUpdate: p.lastUpdate,
            canals: p.canals || 0,
            gates: p.gates || 0,
            ...fallbackDetail[p.id],
          }),
        );

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
    const found = allProfiles.find((p) => p.id === selectedProfileId);
    setFilteredProfiles(found ? [found] : []);
  }, [selectedProfileId, allProfiles]);

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
              <Waves className="w-4 h-4" />
              <span>Profil Irigasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Daerah Irigasi
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                UPT PSDA Wilayah II
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Jelajahi daftar daerah irigasi UPT PSDA Wilayah II dengan
              informasi detail dan peta interaktif. Klik pada penanda untuk
              melihat data dari masing-masing daerah irigasi.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* MAP SECTION */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Peta Interaktif
                  </h2>
                  <p className="text-sm text-gray-500">
                    Klik pada penanda untuk melihat informasi detail tentang
                    setiap area irigasi.
                  </p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <IrrigationMap areas={allProfiles} onAreaSelect={() => {}} />
              </div>
            </div>
          </div>

          {/* FILTER SECTION */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Cari Profil Irigasi
                </h2>
                <p className="text-sm text-gray-500">
                  Pilih profil irigasi dari dropdown untuk melihat detail
                </p>
              </div>
            </div>
            <div className="w-full text-black">
              <Select
                options={allProfiles.map((profile) => ({
                  value: profile.id,
                  label: profile.name,
                }))}
                value={
                  selectedProfileId
                    ? {
                        value: selectedProfileId,
                        label:
                          allProfiles.find((p) => p.id === selectedProfileId)
                            ?.name || "",
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setSelectedProfileId(
                    selectedOption ? selectedOption.value : "",
                  )
                }
                placeholder="Pilih profil irigasi..."
                isSearchable={true}
                isClearable={true}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              <div className="mt-2 text-sm text-gray-500">
                {selectedProfileId === ""
                  ? `Menampilkan semua ${allProfiles.length} profil irigasi.`
                  : `Menampilkan 1 profil terpilih.`}
              </div>
            </div>
          </div>

          {/* PROFILES LIST */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            filteredProfiles.map((area) => {
              const statusInfo =
                statusConfig[area.status] || statusConfig.normal;
              return (
                <div
                  key={area.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* HEADER */}
                  <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 rounded-xl">
                        <Waves className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {area.name}
                        </h2>
                        <p className="text-sm text-gray-500">{area.regency}</p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${statusInfo.dot}`}
                      ></div>
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6 p-6">
                    {/* IMAGE */}
                    <div className="relative h-48 lg:h-full rounded-xl overflow-hidden">
                      <Image
                        src="/images/sample-img.jpeg"
                        alt="img"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* MAIN STATS */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          icon: Droplets,
                          label: "Level Air",
                          value: `${area.waterLevel} m`,
                          color: "blue",
                        },
                        {
                          icon: Ruler,
                          label: "Luas",
                          value: `${area.area} ha`,
                          color: "green",
                        },
                        {
                          icon: LayoutGrid,
                          label: "Saluran",
                          value: `${area.canals} km`,
                          color: "orange",
                        },
                        {
                          icon: DoorOpen,
                          label: "Pintu",
                          value: `${area.gates}`,
                          color: "purple",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={`bg-${stat.color}-50 rounded-xl p-4 flex flex-col items-center justify-center text-center`}
                        >
                          <div className={`text-${stat.color}-600 mb-1`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="font-bold text-lg text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* PROFILE DETAIL */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 mb-3">
                        Detail Profil
                      </h3>
                      {[
                        {
                          label: "Tahun Pembuatan",
                          value: area.constructionYear,
                        },
                        { label: "Desa Layanan", value: area.servedVillages },
                        {
                          label: "Area Potensial",
                          value: area.potentialArea
                            ? `${area.potentialArea} ha`
                            : null,
                        },
                        {
                          label: "Area Fungsional",
                          value: area.functionalArea
                            ? `${area.functionalArea} ha`
                            : null,
                        },
                        {
                          label: "Debit Andalan",
                          value: area.dischargeCapacity
                            ? `${area.dischargeCapacity} m³/dtk`
                            : null,
                        },
                        {
                          label: "Panjang Saluran",
                          value: area.channelLength
                            ? `${area.channelLength} km`
                            : null,
                        },
                        {
                          label: "Luas DAS",
                          value: area.watershedArea
                            ? `${area.watershedArea} ha`
                            : null,
                        },
                        { label: "Produktivitas", value: area.productivity },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-sm text-gray-500">
                            {item.label}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {item.value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STRUCTURES */}
                  <div className="bg-blue-50/50 p-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Infrastruktur Bangunan
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {[
                        {
                          label: "Total Bangunan",
                          value: area.totalStructures,
                        },
                        { label: "Bendung", value: area.mainStructure },
                        {
                          label: "Bangunan Bagi",
                          value: area.divisionStructure,
                        },
                        { label: "Bangunan Muka", value: area.intakeStructure },
                        { label: "Bangunan Terjun", value: area.dropStructure },
                        { label: "Talang", value: area.aqueduct },
                        {
                          label: "Gorong Pembuang",
                          value: area.drainageCulvert,
                        },
                        { label: "Gorong Jalan", value: area.roadCulvert },
                        { label: "Got Miring", value: area.slopingDrain },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-white rounded-xl p-4 text-center shadow-sm"
                        >
                          <div className="text-sm font-bold text-blue-600 mb-1">
                            {item.value ?? "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
