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
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Data Ketinggian Air</h3>
            <p className="text-gray-600 mb-4">Kelola data TMA (Tinggi Muka Air)</p>
            <a href="/admin/data/input?type=water-level" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=water-level" className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Data Curah Hujan</h3>
            <p className="text-gray-600 mb-4">Kelola pengukuran curah hujan</p>
            <a href="/admin/data/input?type=rainfall" className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=rainfall" className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Impor CSV</h3>
            <p className="text-gray-600 mb-4">Impor data massal dari file CSV</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 cursor-pointer rounded hover:bg-purple-700 transition-colors">
              Impor Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Ekspor Data</h3>
            <p className="text-gray-600 mb-4">Ekspor data ke format CSV/Excel</p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 cursor-pointer rounded hover:bg-orange-700 transition-colors">
              Ekspor Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-teal-600">Data Historis</h3>
            <p className="text-gray-600 mb-4">Lihat dan edit catatan historis</p>
            <button className="w-full bg-teal-600 text-white py-2 px-4 cursor-pointer rounded hover:bg-teal-700 transition-colors">
              Lihat Riwayat
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Validasi Data</h3>
            <p className="text-gray-600 mb-4">Validasi dan bersihkan data yang diimpor</p>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
              Validasi Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-amber-600">Data Tanaman</h3>
            <p className="text-gray-600 mb-4">Kelola data tanaman dan produksi</p>
            <a href="/admin/data/input?type=crop" className="block w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=crop" className="block w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Data Petani</h3>
            <p className="text-gray-600 mb-4">Kelola data petani dan statistik</p>
            <a href="/admin/data/input?type=farmer" className="block w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors text-center mb-2">
              Input Data
            </a>
            <a href="/admin/data/management?type=farmer" className="block w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors text-center">
              Kelola Data
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}