'use client';

import React, { useState, useEffect } from 'react';

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
  order: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function KepegawaianPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">No</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Jabatan</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Nama Pegawai</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Pendidikan</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Umur</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Wilayah Kerja</th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((pegawai, index) => (
                          <tr key={pegawai.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 border-b text-gray-700">{index + 1}</td>
                            <td className="py-3 px-4 border-b text-gray-700">{pegawai.position}</td>
                            <td className="py-3 px-4 border-b text-gray-700 font-medium">{pegawai.name}</td>
                            <td className="py-3 px-4 border-b text-gray-700">{pegawai.education || '-'}</td>
                            <td className="py-3 px-4 border-b text-gray-700">{pegawai.age ? pegawai.age + ' tahun' : '-'}</td>
                            <td className="py-3 px-4 border-b text-gray-700">{pegawai.workRegion || '-'}</td>
                            <td className="py-3 px-4 border-b">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pegawai.status === 'PNS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {pegawai.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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