'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Data</h1>
          <p className="text-gray-600 mt-2">Kelola data irigasi, impor, dan ekspor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-semibold text-blue-600">Data Ketinggian Air</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola data TMA (Tinggi Muka Air)</p>
            <a href="/admin/data/input?type=water-level" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=water-level" className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 className="text-xl font-semibold text-green-600">Data Curah Hujan</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola pengukuran curah hujan</p>
            <a href="/admin/data/input?type=rainfall" className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=rainfall" className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <h3 className="text-xl font-semibold text-purple-600">Impor CSV</h3>
            </div>
            <p className="text-gray-600 mb-4">Impor data massal dari file CSV</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 cursor-pointer rounded hover:bg-purple-700 transition-colors">
              Impor Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-orange-600">Ekspor Data</h3>
            </div>
            <p className="text-gray-600 mb-4">Ekspor data ke format CSV/Excel</p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 cursor-pointer rounded hover:bg-orange-700 transition-colors">
              Ekspor Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <h3 className="text-xl font-semibold text-teal-600">Data Irigasi</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola data irigasi, pantau dan analisis</p>
            <a href="/admin/data/management" className="block w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-600">Manajemen Lokasi</h3>
            </div>
            <p className="text-gray-600 mb-4">Atur dan kelola lokasi irigasi</p>
            <a href="/admin/data/locations" className="block w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-center">
              Kelola Lokasi
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-amber-600">Data Tanaman</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola data tanaman dan produksi</p>
            <a href="/admin/data/input?type=crop" className="block w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=crop" className="block w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-indigo-600">Data Petani</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola data petani dan statistik</p>
            <a href="/admin/data/input?type=farmer" className="block w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=farmer" className="block w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-emerald-600">Kelompok Tani</h3>
            </div>
            <p className="text-gray-600 mb-4">Kelola data kelompok tani dan anggota</p>
            <a href="/admin/farmer-groups" className="block w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition-colors text-center">
              Kelola Kelompok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
