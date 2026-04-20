'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/employees');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data.employees || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Count employees by department/position (simplified)
  const countByDepartment = (dept: string) => employees.filter(emp => emp.department === dept).length;
  const countByPosition = (pos: string) => employees.filter(emp => emp.position === pos).length;

  const pengamatCount = countByPosition('Pengamat');
  const stafOperasiCount = countByDepartment('Operasi & Pemeliharaan');
  const petugasTeknisCount = employees.filter(emp => emp.position.includes('Petugas')).length;
  const juruOperasiCount = countByPosition('Juru Operasi dan Pemeliharaan');

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Data Kepegawaian</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Informasi mengenai struktur kepegawaian dan data staff di Kantor Pengamatan Irigasi Bunta.
          </p>
        </div>

        {/* Staff Overview Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Struktur Kepegawaian</h2>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Jumlah Pegawai</h3>
                <p className="text-gray-700 mb-4">
                  Kantor Pengamatan Irigasi Bunta memiliki total {employees.length} orang pegawai yang terdiri dari berbagai jabatan dan bidang keahlian.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-blue-700 mb-2">{pengamatCount}</div>
                    <h4 className="text-lg font-semibold text-blue-800">Pengamat</h4>
                    <p className="text-gray-600">Pimpinan tertinggi</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-yellow-700 mb-2">{juruOperasiCount}</div>
                    <h4 className="text-lg font-semibold text-yellow-800">Juru Operasi</h4>
                    <p className="text-gray-600">Bertanggung jawab atas operasi dan pemeliharaan</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-green-700 mb-2">{stafOperasiCount}</div>
                    <h4 className="text-lg font-semibold text-green-800">Staf Operasi & Pemeliharaan</h4>
                    <p className="text-gray-600">Bertugas di lapangan</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-purple-700 mb-2">{petugasTeknisCount}</div>
                    <h4 className="text-lg font-semibold text-purple-800">Petugas Teknis</h4>
                    <p className="text-gray-600">Petugas pintu air dan operasi bendung</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Jabatan</h3>
                <p className="text-gray-700 mb-4">
                  Berikut adalah daftar jabatan beserta nama pegawai yang saat ini bertugas:
                </p>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    Gagal memuat data pegawai: {error}
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Tidak ada data pegawai.
                  </div>
                ) : (
                  <div>
                    {/* Search filter */}
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Cari pegawai berdasarkan nama atau jabatan..."
                        className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {filteredEmployees.length === 0 && employees.length > 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Tidak ada pegawai yang sesuai dengan pencarian '{searchTerm}'.
                      </div>
                    )}
                    {filteredEmployees.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {paginatedEmployees.map((pegawai) => (
                          <div
                          key={pegawai.id}
                          className="flex bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          {/* Photo - LEFT */}
                          <div className="relative w-40 h-full bg-gray-100 flex-shrink-0">
                            {pegawai.photo ? (
                              <Image
                                src={pegawai.photo}
                                alt={pegawai.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full bg-blue-100 text-blue-800">
                                <div className="text-3xl font-bold">
                                  {pegawai.name.charAt(0)}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Details - RIGHT */}
                          <div className="p-6 flex flex-col justify-between w-full">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-800">
                                  {pegawai.name}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    pegawai.status === 'PNS'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {pegawai.status}
                                </span>
                              </div>

                              <div className="space-y-1 text-sm text-gray-600">
                                <div>
                                  <span className="font-bold text-black">Jabatan:</span>{' '}
                                  {pegawai.position}
                                </div>
                                <div>
                                  <span className="font-bold text-black">Umur:</span>{' '}
                                  {pegawai.age ? `${pegawai.age} tahun` : '-'}
                                </div>
                                <div>
                                  <span className="font-bold text-black">Wilayah:</span>{' '}
                                  {pegawai.workRegion || '-'}
                                </div>
                                <div>
                                  <span className="font-bold text-black">Lokasi:</span>{' '}
                                  {pegawai.location || '-'}
                                </div>
                              </div>
                            </div>

                            {/* WhatsApp Button */}
                            {pegawai.whatsapp && pegawai.whatsapp.trim() !== '' && (
                            <a
                              href={`https://wa.me/${pegawai.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              {/* Icon WhatsApp */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M20.52 3.48A11.83 11.83 0 0012.06 0C5.5 0 .1 5.4.1 12c0 2.1.55 4.16 1.6 5.98L0 24l6.23-1.63A11.9 11.9 0 0012.06 24h.01c6.56 0 11.96-5.4 11.96-12 0-3.2-1.25-6.21-3.51-8.52zM12.07 21.8c-1.8 0-3.56-.48-5.1-1.39l-.37-.22-3.7.97.99-3.6-.24-.38A9.76 9.76 0 012.3 12c0-5.4 4.38-9.8 9.77-9.8 2.6 0 5.04 1.01 6.88 2.84A9.7 9.7 0 0121.8 12c0 5.4-4.38 9.8-9.73 9.8zm5.39-7.3c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.13 3.25 5.17 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.13-.28-.2-.58-.35z" />
                              </svg>

                              <span>WhatsApp | <span className="text-black"> {pegawai.whatsapp}</span></span>
                            </a>
                          )}
                          </div>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2 flex-wrap">
                    
                    {/* Prev */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1 bg-white rounded-lg shadow-md border border-gray-200 text-sm text-black bg-white hover:bg-gray-100"
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg shadow-md border border-gray-200 text-sm text-black ${
                          currentPage === page
                            ? 'bg-blue-800 text-white'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="px-3 py-1 bg-white rounded-lg shadow-md border border-gray-200 text-sm text-black bg-white hover:bg-gray-100"
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
                <p className="text-gray-600 text-sm mt-4">
                  * Data kepegawaian diperbarui per {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Informasi Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Sistem Penggajian</h3>
                <p className="text-blue-100 mb-4">
                  Penggajian dilakukan setiap bulan melalui mekanisme APBD Kabupaten Luwuk Banggai. Pegawai PNS menerima gaji sesuai golongan, sedangkan pegawai honorer menerima tunjangan berdasarkan beban kerja.
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2">
                  <li>Gaji pokok sesuai golongan dan masa kerja</li>
                  <li>Tunjangan kinerja dan tunjangan daerah</li>
                  <li>Asuransi kesehatan (BPJS)</li>
                  <li>Dana pensiun untuk PNS</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Pengembangan Kompetensi</h3>
                <p className="text-blue-100 mb-4">
                  Kantor secara rutin mengadakan pelatihan dan workshop untuk meningkatkan kompetensi pegawai dalam bidang irigasi, teknologi pengamatan, dan manajemen air.
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2">
                  <li>Pelatihan teknis operasi bendung dan pintu air</li>
                  <li>Workshop penggunaan perangkat lunak pengolahan data</li>
                  <li>Seminar nasional tentang pengelolaan sumber daya air</li>
                  <li>Pendidikan lanjut bagi pegawai yang memenuhi syarat</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact HR Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-green-800 mb-6">Kontak Bagian Kepegawaian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Kepala Subbagian Tata Usaha</h3>
                <p className="text-gray-700 mb-2"><strong>Nama:</strong> Dra. Sri Wahyuni, M.Si.</p>
                <p className="text-gray-700 mb-2"><strong>Telepon:</strong> (0461) 123456</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> tatausaha@irigasibunta.com</p>
                <p className="text-gray-700">Bertanggung jawab atas administrasi kepegawaian, penggajian, dan pengembangan SDM.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Jam Layanan</h3>
                <p className="text-gray-700 mb-2"><strong>Senin - Kamis:</strong> 08.00 - 16.00 WITA</p>
                <p className="text-gray-700 mb-2"><strong>Jumat:</strong> 08.00 - 11.30 WITA</p>
                <p className="text-gray-700 mb-2"><strong>Sabtu & Minggu:</strong> Libur</p>
                <p className="text-gray-700">Untuk konsultasi kepegawaian, silakan datang langsung ke kantor atau hubungi via telepon/email.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}