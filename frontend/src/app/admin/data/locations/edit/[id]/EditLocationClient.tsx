"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

interface LocationProfile {
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
}

export default function EditLocationClient() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<LocationProfile | null>(null);

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
        });
      } else {
        setError("Gagal mengambil data lokasi");
      }
    } catch (err) {
      setError("Error mengambil data lokasi");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchProfile();
    }
  }, [status, params.id, fetchProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
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

      const response = await fetch(
        `/api/admin/irrigation-profiles/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        router.push("/admin/data/locations");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Gagal memperbarui lokasi");
      }
    } catch (err) {
      setError("Error memperbarui lokasi");
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
        <div className="text-red-600">Lokasi tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Lokasi Irigasi
          </h1>
          <p className="text-gray-600 mt-2">
            Perbarui detail lokasi irigasi
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Dasar */}
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
                  Nama Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama lokasi irigasi"
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
                  placeholder="Deskripsi singkat tentang lokasi irigasi"
                />
              </div>

              {/* Location (Alamat) */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alamat Lokasi
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
                  Luas Baku (ha) <span className="text-red-500">*</span>
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
                  Type Bendung
                </label>
                <input
                  type="text"
                  id="waterLevel"
                  name="waterLevel"
                  value={formData.waterLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Mercu"
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
                  Panjang Saluran
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
