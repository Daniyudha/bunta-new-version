"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface IrrigationProfile {
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
  waterSource: string | null;
  regency: string | null;
  constructionYear: number | null;
  servedVillages: string | null;
  potentialArea: number | null;
  functionalArea: number | null;
  dischargeCapacity: number | null;
  channelLength: number | null;
  watershedArea: number | null;
  productivity: string | null;
  totalStructures: number | null;
  mainStructure: string | null;
  divisionStructure: number | null;
  intakeStructure: number | null;
  dropStructure: number | null;
  aqueduct: number | null;
  drainageCulvert: number | null;
  roadCulvert: number | null;
  slopingDrain: number | null;
  buildingScheme?: string | null;
  networkScheme?: string | null;
  rttg?: string | null;
  plantingSchedule?: string | null;
}

interface FormData {
  name: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  area: string;
  waterLevel: string;
  status: string;
  canals: string;
  gates: string;
  waterSource: string;
  regency: string;
  constructionYear: string;
  servedVillages: string;
  potentialArea: string;
  functionalArea: string;
  dischargeCapacity: string;
  channelLength: string;
  watershedArea: string;
  productivity: string;
  totalStructures: string;
  mainStructure: string;
  divisionStructure: string;
  intakeStructure: string;
  dropStructure: string;
  aqueduct: string;
  drainageCulvert: string;
  roadCulvert: string;
  slopingDrain: string;
  buildingScheme: string;
  networkScheme: string;
  rttg: string;
  plantingSchedule: string;
}

const imageFields = [
  { key: "buildingScheme", label: "BUILDING SCHEME (Jpg)" },
  { key: "networkScheme", label: "NETWORK SCHEME (Jpg)" },
  { key: "rttg", label: "RTTG (Jpg)" },
  { key: "plantingSchedule", label: "PLANTING SCHEDULE (Jpg)" },
] as const;

export default function EditIrrigationProfileClient() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<IrrigationProfile | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    area: "",
    waterLevel: "",
    status: "normal",
    canals: "",
    gates: "",
    waterSource: "",
    regency: "",
    constructionYear: "",
    servedVillages: "",
    potentialArea: "",
    functionalArea: "",
    dischargeCapacity: "",
    channelLength: "",
    watershedArea: "",
    productivity: "",
    totalStructures: "",
    mainStructure: "",
    divisionStructure: "",
    intakeStructure: "",
    dropStructure: "",
    aqueduct: "",
    drainageCulvert: "",
    roadCulvert: "",
    slopingDrain: "",
    buildingScheme: "",
    networkScheme: "",
    rttg: "",
    plantingSchedule: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/irrigation-profiles/${params.id}`,
      );
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          description: profileData.description || "",
          location: profileData.location || "",
          latitude:
            profileData.latitude !== null ? String(profileData.latitude) : "",
          longitude:
            profileData.longitude !== null ? String(profileData.longitude) : "",
          area: String(profileData.area),
          waterLevel:
            profileData.waterLevel !== null
              ? String(profileData.waterLevel)
              : "",
          status: profileData.status || "normal",
          canals: profileData.canals !== null ? String(profileData.canals) : "",
          gates: profileData.gates !== null ? String(profileData.gates) : "",
          waterSource: profileData.waterSource || "",
          regency: profileData.regency || "",
          constructionYear:
            profileData.constructionYear !== null
              ? String(profileData.constructionYear)
              : "",
          servedVillages: profileData.servedVillages || "",
          potentialArea:
            profileData.potentialArea !== null
              ? String(profileData.potentialArea)
              : "",
          functionalArea:
            profileData.functionalArea !== null
              ? String(profileData.functionalArea)
              : "",
          dischargeCapacity:
            profileData.dischargeCapacity !== null
              ? String(profileData.dischargeCapacity)
              : "",
          channelLength:
            profileData.channelLength !== null
              ? String(profileData.channelLength)
              : "",
          watershedArea:
            profileData.watershedArea !== null
              ? String(profileData.watershedArea)
              : "",
          productivity: profileData.productivity || "",
          totalStructures:
            profileData.totalStructures !== null
              ? String(profileData.totalStructures)
              : "",
          mainStructure: profileData.mainStructure || "",
          divisionStructure:
            profileData.divisionStructure !== null
              ? String(profileData.divisionStructure)
              : "",
          intakeStructure:
            profileData.intakeStructure !== null
              ? String(profileData.intakeStructure)
              : "",
          dropStructure:
            profileData.dropStructure !== null
              ? String(profileData.dropStructure)
              : "",
          aqueduct:
            profileData.aqueduct !== null ? String(profileData.aqueduct) : "",
          drainageCulvert:
            profileData.drainageCulvert !== null
              ? String(profileData.drainageCulvert)
              : "",
          roadCulvert:
            profileData.roadCulvert !== null
              ? String(profileData.roadCulvert)
              : "",
          slopingDrain:
            profileData.slopingDrain !== null
              ? String(profileData.slopingDrain)
              : "",
          buildingScheme: profileData.buildingScheme || "",
          networkScheme: profileData.networkScheme || "",
          rttg: profileData.rttg || "",
          plantingSchedule: profileData.plantingSchedule || "",
        });
      } else {
        setError("Gagal mengambil data profil irigasi");
      }
    } catch (error) {
      setError("Error mengambil data profil irigasi");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchProfile();
    }
  }, [status, params.id, fetchProfile]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/admin/irrigation-profiles/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const result = await uploadRes.json();
        setFormData((prev) => ({ ...prev, [fieldKey]: result.url }));
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Build request body - only include non-empty values
      const body: Record<string, unknown> = {
        name: formData.name,
        area: formData.area,
      };

      if (formData.description) body.description = formData.description;
      if (formData.location) body.location = formData.location;
      if (formData.latitude) body.latitude = formData.latitude;
      if (formData.longitude) body.longitude = formData.longitude;
      if (formData.waterLevel) body.waterLevel = formData.waterLevel;
      if (formData.status) body.status = formData.status;
      if (formData.canals) body.canals = formData.canals;
      if (formData.gates) body.gates = formData.gates;
      if (formData.waterSource) body.waterSource = formData.waterSource;
      if (formData.regency) body.regency = formData.regency;
      if (formData.constructionYear)
        body.constructionYear = formData.constructionYear;
      if (formData.servedVillages)
        body.servedVillages = formData.servedVillages;
      if (formData.potentialArea) body.potentialArea = formData.potentialArea;
      if (formData.functionalArea)
        body.functionalArea = formData.functionalArea;
      if (formData.dischargeCapacity)
        body.dischargeCapacity = formData.dischargeCapacity;
      if (formData.channelLength) body.channelLength = formData.channelLength;
      if (formData.watershedArea) body.watershedArea = formData.watershedArea;
      if (formData.productivity) body.productivity = formData.productivity;
      if (formData.totalStructures)
        body.totalStructures = formData.totalStructures;
      if (formData.mainStructure) body.mainStructure = formData.mainStructure;
      if (formData.divisionStructure)
        body.divisionStructure = formData.divisionStructure;
      if (formData.intakeStructure)
        body.intakeStructure = formData.intakeStructure;
      if (formData.dropStructure) body.dropStructure = formData.dropStructure;
      if (formData.aqueduct) body.aqueduct = formData.aqueduct;
      if (formData.drainageCulvert)
        body.drainageCulvert = formData.drainageCulvert;
      if (formData.roadCulvert) body.roadCulvert = formData.roadCulvert;
      if (formData.slopingDrain) body.slopingDrain = formData.slopingDrain;
      if (formData.buildingScheme)
        body.buildingScheme = formData.buildingScheme;
      if (formData.networkScheme) body.networkScheme = formData.networkScheme;
      if (formData.rttg) body.rttg = formData.rttg;
      if (formData.plantingSchedule)
        body.plantingSchedule = formData.plantingSchedule;

      const response = await fetch(
        `/api/admin/irrigation-profiles/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        router.push("/admin/irrigation-profiles");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Gagal memperbarui profil irigasi");
      }
    } catch (error) {
      setError("Error memperbarui profil irigasi");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Profil irigasi tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Profil Irigasi
          </h1>
          <p className="text-gray-600 mt-2">Perbarui detail profil irigasi</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Informasi Dasar */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Informasi Dasar
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Profil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama profil irigasi"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi singkat tentang profil irigasi"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Lokasi
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Kecamatan Tawang"
                />
              </div>

              {/* Regency */}
              <div>
                <label
                  htmlFor="regency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Kabupaten
                </label>
                <input
                  type="text"
                  id="regency"
                  name="regency"
                  value={formData.regency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Kabupaten Banggai"
                />
              </div>

              {/* Water Source */}
              <div>
                <label
                  htmlFor="waterSource"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sumber Air
                </label>
                <input
                  type="text"
                  id="waterSource"
                  name="waterSource"
                  value={formData.waterSource}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Sungai Cigunung"
                />
              </div>

              {/* Construction Year */}
              <div>
                <label
                  htmlFor="constructionYear"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tahun Pembuatan
                </label>
                <input
                  type="number"
                  id="constructionYear"
                  name="constructionYear"
                  value={formData.constructionYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2005"
                />
              </div>

              {/* Latitude */}
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-7.1234"
                />
              </div>

              {/* Longitude */}
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="107.5678"
                />
              </div>

              {/* Area */}
              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Luas Area (ha) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 150.5"
                />
              </div>

              {/* Water Level */}
              <div>
                <label
                  htmlFor="waterLevel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tinggi Muka Air (cm)
                </label>
                <input
                  type="number"
                  step="any"
                  id="waterLevel"
                  name="waterLevel"
                  value={formData.waterLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 85"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="low">Rendah</option>
                  <option value="high">Tinggi</option>
                  <option value="critical">Kritis</option>
                </select>
              </div>

              {/* Canals */}
              <div>
                <label
                  htmlFor="canals"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jumlah Saluran
                </label>
                <input
                  type="number"
                  id="canals"
                  name="canals"
                  value={formData.canals}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 5"
                />
              </div>

              {/* Gates */}
              <div>
                <label
                  htmlFor="gates"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jumlah Pintu Air
                </label>
                <input
                  type="number"
                  id="gates"
                  name="gates"
                  value={formData.gates}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 3"
                />
              </div>
            </div>
          </div>

          {/* Section: Detail Profil */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Detail Profil
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Served Villages */}
              <div>
                <label
                  htmlFor="servedVillages"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Desa Layanan
                </label>
                <input
                  type="text"
                  id="servedVillages"
                  name="servedVillages"
                  value={formData.servedVillages}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Desa A, Desa B, Desa C"
                />
              </div>

              {/* Productivity */}
              <div>
                <label
                  htmlFor="productivity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Produktivitas
                </label>
                <input
                  type="text"
                  id="productivity"
                  name="productivity"
                  value={formData.productivity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Padi 5 ton/ha"
                />
              </div>

              {/* Potential Area */}
              <div>
                <label
                  htmlFor="potentialArea"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Area Potensial (ha)
                </label>
                <input
                  type="number"
                  step="any"
                  id="potentialArea"
                  name="potentialArea"
                  value={formData.potentialArea}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1200"
                />
              </div>

              {/* Functional Area */}
              <div>
                <label
                  htmlFor="functionalArea"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Area Fungsional (ha)
                </label>
                <input
                  type="number"
                  step="any"
                  id="functionalArea"
                  name="functionalArea"
                  value={formData.functionalArea}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 950"
                />
              </div>

              {/* Discharge Capacity */}
              <div>
                <label
                  htmlFor="dischargeCapacity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Debit Andalan (m³/dtk)
                </label>
                <input
                  type="number"
                  step="any"
                  id="dischargeCapacity"
                  name="dischargeCapacity"
                  value={formData.dischargeCapacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2.5"
                />
              </div>

              {/* Channel Length */}
              <div>
                <label
                  htmlFor="channelLength"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Panjang Saluran (km)
                </label>
                <input
                  type="number"
                  step="any"
                  id="channelLength"
                  name="channelLength"
                  value={formData.channelLength}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 15"
                />
              </div>

              {/* Watershed Area */}
              <div>
                <label
                  htmlFor="watershedArea"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Luas DAS (ha)
                </label>
                <input
                  type="number"
                  step="any"
                  id="watershedArea"
                  name="watershedArea"
                  value={formData.watershedArea}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 3000"
                />
              </div>
            </div>
          </div>

          {/* Section: Infrastruktur Bangunan */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Infrastruktur Bangunan
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Total Structures */}
              <div>
                <label
                  htmlFor="totalStructures"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Bangunan
                </label>
                <input
                  type="number"
                  id="totalStructures"
                  name="totalStructures"
                  value={formData.totalStructures}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 25"
                />
              </div>

              {/* Main Structure */}
              <div>
                <label
                  htmlFor="mainStructure"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bendung
                </label>
                <input
                  type="text"
                  id="mainStructure"
                  name="mainStructure"
                  value={formData.mainStructure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Bendung Beton"
                />
              </div>

              {/* Division Structure */}
              <div>
                <label
                  htmlFor="divisionStructure"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bangunan Bagi
                </label>
                <input
                  type="number"
                  id="divisionStructure"
                  name="divisionStructure"
                  value={formData.divisionStructure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 5"
                />
              </div>

              {/* Intake Structure */}
              <div>
                <label
                  htmlFor="intakeStructure"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bangunan Muka / Intake
                </label>
                <input
                  type="number"
                  id="intakeStructure"
                  name="intakeStructure"
                  value={formData.intakeStructure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 3"
                />
              </div>

              {/* Drop Structure */}
              <div>
                <label
                  htmlFor="dropStructure"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bangunan Terjun
                </label>
                <input
                  type="number"
                  id="dropStructure"
                  name="dropStructure"
                  value={formData.dropStructure}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 4"
                />
              </div>

              {/* Aqueduct */}
              <div>
                <label
                  htmlFor="aqueduct"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Talang
                </label>
                <input
                  type="number"
                  id="aqueduct"
                  name="aqueduct"
                  value={formData.aqueduct}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2"
                />
              </div>

              {/* Drainage Culvert */}
              <div>
                <label
                  htmlFor="drainageCulvert"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gorong Pembuang
                </label>
                <input
                  type="number"
                  id="drainageCulvert"
                  name="drainageCulvert"
                  value={formData.drainageCulvert}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 6"
                />
              </div>

              {/* Road Culvert */}
              <div>
                <label
                  htmlFor="roadCulvert"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gorong Jalan
                </label>
                <input
                  type="number"
                  id="roadCulvert"
                  name="roadCulvert"
                  value={formData.roadCulvert}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 3"
                />
              </div>

              {/* Sloping Drain */}
              <div>
                <label
                  htmlFor="slopingDrain"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Got Miring
                </label>
                <input
                  type="number"
                  id="slopingDrain"
                  name="slopingDrain"
                  value={formData.slopingDrain}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 2"
                />
              </div>
            </div>
          </div>

          {/* Section: Gambar & Dokumen */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Gambar & Dokumen
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {imageFields.map((field) => {
                const isUploading = uploadingImage === field.key;
                const imgUrl = formData[field.key as keyof FormData] as string;

                return (
                  <div
                    key={field.key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {/* Header */}
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                    </div>

                    {/* Content */}
                    {imgUrl ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                        <Image
                          src={imgUrl}
                          alt={field.label}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />

                        {/* Overlay Hapus */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                [field.key]: "",
                              }))
                            }
                            className="inline-flex items-center justify-center p-3 rounded-full hover:bg-white/20 transition transform scale-90 group-hover:scale-100 shadow cursor-pointer"
                            title="Hapus gambar"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-40 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                        <div className="text-center">
                          {isUploading ? (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <svg
                                className="animate-spin h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              <p className="text-xs">Uploading...</p>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-8 w-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-2 text-xs text-gray-400">
                                Klik untuk upload
                              </p>
                            </>
                          )}
                        </div>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => handleImageUpload(e, field.key)}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
