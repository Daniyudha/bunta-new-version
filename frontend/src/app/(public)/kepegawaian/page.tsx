"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  CalendarDays,
  Heart,
  Target,
  Star,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  education: string | null;
  status: string;
  photo: string | null;
  department: string | null;
  age: number | null;
  workRegion: string | null;
  whatsapp: string | null;
  location: string | null;
  pangkat_golongan: string | null;
  nip: string | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function KepegawaianPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Count employees by position (simplified)
  const countByPosition = (pos: string) =>
    employees.filter((emp) => emp.position === pos).length;

  const pengamatCount = countByPosition("Pengamat");
  const petugasTeknisCount = employees.filter((emp) =>
    emp.position.includes("Petugas"),
  ).length;
  const juruOperasiCount = countByPosition("Juru Operasi dan Pemeliharaan");

  const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const quickStats = [
    {
      label: "Total Pegawai",
      value: employees.length,
      icon: Users,
      color: "blue",
      desc: "Seluruh staff aktif",
    },
    {
      label: "Pengamat",
      value: pengamatCount,
      icon: Star,
      color: "amber",
      desc: "Pimpinan tertinggi",
    },
    {
      label: "Juru Operasi",
      value: juruOperasiCount,
      icon: Briefcase,
      color: "emerald",
      desc: "Operasi & pemeliharaan",
    },
    {
      label: "Petugas Teknis",
      value: petugasTeknisCount,
      icon: ShieldCheck,
      color: "rose",
      desc: "Petugas lapangan",
    },
  ];

  const statColors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("${heroPattern}")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Users className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">
                Sumber Daya Manusia
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Data Kepegawaian
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Informasi mengenai struktur kepegawaian dan data staff di CIKASDA
              UPT PSDA Wilayah II. Transparansi dan profesionalisme adalah
              komitmen kami.
            </p>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 60C360 60 360 30 720 30C1080 30 1080 0 1440 0V60H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickStats.map((stat) => {
            const colors = statColors[stat.color as keyof typeof statColors];
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <div className={`text-3xl font-bold ${colors.text}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Employee List Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Daftar Pegawai
                </h2>
                <p className="text-gray-500 mt-1">
                  Total {filteredEmployees.length} pegawai ditemukan
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pegawai berdasarkan nama atau jabatan..."
                  className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                <p className="font-semibold">Gagal memuat data pegawai</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada data pegawai.</p>
              </div>
            ) : (
              <>
                {filteredEmployees.length === 0 && employees.length > 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Tidak ada pegawai yang sesuai dengan pencarian &ldquo;
                      {searchTerm}&rdquo;.
                    </p>
                  </div>
                )}
                {filteredEmployees.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedEmployees.map((pegawai) => (
                      <div
                        key={pegawai.id}
                        className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Photo */}
                          <div className="relative w-full sm:w-44 h-48 sm:h-auto bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0">
                            {pegawai.photo ? (
                              <Image
                                src={pegawai.photo}
                                alt={pegawai.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Image
                                src="/images/default-foto.jpg"
                                alt={pegawai.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Details */}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    {pegawai.name}
                                  </h3>
                                  <p className="text-sm text-blue-600 font-medium">
                                    {pegawai.position}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                    pegawai.status === "PNS"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  <BadgeCheck className="w-3 h-3" />
                                  {pegawai.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-4">
                                {pegawai.pangkat_golongan && (
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span>{pegawai.pangkat_golongan}</span>
                                  </div>
                                )}
                                {pegawai.age && (
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                    <span>{pegawai.age} tahun</span>
                                  </div>
                                )}
                                {pegawai.workRegion && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{pegawai.workRegion}</span>
                                  </div>
                                )}
                                {pegawai.education && (
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                    <span>{pegawai.education}</span>
                                  </div>
                                )}
                                {pegawai.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{pegawai.location}</span>
                                  </div>
                                )}
                                {pegawai.nip && (
                                  <div className="flex items-center gap-2 col-span-2">
                                    <BadgeCheck className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs">
                                      NIP: {pegawai.nip}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* WhatsApp Button */}
                            {pegawai.whatsapp &&
                              pegawai.whatsapp.trim() !== "" && (
                                <a
                                  href={`https://wa.me/${pegawai.whatsapp.replace(/\D/g, "").replace(/^0/, "62")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path d="M20.52 3.48A11.83 11.83 0 0012.06 0C5.5 0 .1 5.4.1 12c0 2.1.55 4.16 1.6 5.98L0 24l6.23-1.63A11.9 11.9 0 0012.06 24h.01c6.56 0 11.96-5.4 11.96-12 0-3.2-1.25-6.21-3.51-8.52zM12.07 21.8c-1.8 0-3.56-.48-5.1-1.39l-.37-.22-3.7.97.99-3.6-.24-.38A9.76 9.76 0 012.3 12c0-5.4 4.38-9.8 9.77-9.8 2.6 0 5.04 1.01 6.88 2.84A9.7 9.7 0 0121.8 12c0 5.4-4.38 9.8-9.73 9.8zm5.39-7.3c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.13 3.25 5.17 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.28-.2-.58-.35z" />
                                  </svg>
                                  <span>
                                    WhatsApp:{" "}
                                    <span className="text-gray-600">
                                      {pegawai.whatsapp}
                                    </span>
                                  </span>
                                </a>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10 gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            <p className="text-gray-400 text-sm mt-6 text-center">
              * Data kepegawaian diperbarui per{" "}
              {new Date().toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="mb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 md:p-12">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("${heroPattern}")`,
                backgroundSize: "60px 60px",
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-10 text-center">
                Informasi Kepegawaian
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Updated Feature */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Pembaruan Data Pegawai
                    </h3>
                  </div>

                  <p className="text-gray-300 mb-4">
                    Data kepegawaian diperbarui secara berkala untuk memastikan
                    informasi yang tersimpan tetap akurat dan terkini, mencakup
                    identitas, penempatan, serta status kepegawaian.
                  </p>

                  <ul className="space-y-2">
                    {[
                      "Pembaruan data profil pegawai secara berkala",
                      "Penyesuaian penempatan wilayah kerja",
                      "Perubahan status kepegawaian dan jabatan",
                      "Validasi dan verifikasi data oleh admin",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-400 text-sm"
                      >
                        <ChevronRight className="w-4 h-4 text-amber-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature 2 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Pengembangan Kompetensi
                    </h3>
                  </div>

                  <p className="text-gray-300 mb-4">
                    Peningkatan kompetensi pegawai dilakukan melalui pelatihan
                    dan kegiatan pengembangan untuk mendukung profesionalitas
                    dalam pengelolaan irigasi dan sumber daya air.
                  </p>

                  <ul className="space-y-2">
                    {[
                      "Pelatihan teknis operasi bendung dan pintu air",
                      "Workshop penggunaan sistem dan pengolahan data",
                      "Seminar terkait pengelolaan sumber daya air",
                      "Program pengembangan karier dan pendidikan lanjut",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-400 text-sm"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact HR Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-4">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Kontak Kepegawaian
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Kontak Bagian Kepegawaian
              </h2>
              <p className="text-gray-500 mt-2">
                Hubungi kami untuk informasi lebih lanjut
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Kepala Subbagian Tata Usaha
                    </h3>
                    <p className="text-sm text-blue-600">
                      Sadriyani Anwar, S.P.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+62 813-4123-3483</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>cikasda@sultengprov.go.id</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Bertanggung jawab atas administrasi umum, kepegawaian,
                  dan pengembangan SDM.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Jam Layanan
                    </h3>
                    <p className="text-sm text-amber-600">Jadwal operasional</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      <strong>Senin - Jumat:</strong> 08.00 - 16.00 WITA
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>
                      <strong>Sabtu & Minggu:</strong> Libur
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Untuk konsultasi kepegawaian, silakan datang langsung ke
                  kantor atau hubungi via telepon/email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
