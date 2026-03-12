'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function IrrigationData() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Irrigation Data</h1>
          <p className="text-gray-600 mt-2">Manage irrigation data including water levels and rainfall</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Water Level Data</h3>
            <p className="text-gray-600 mb-4">Manage water level measurements</p>
            <a href="/admin/data/management?type=water-level" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center">
              Manage Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Rainfall Data</h3>
            <p className="text-gray-600 mb-4">Manage rainfall measurements</p>
            <a href="/admin/data/management?type=rainfall" className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center">
              Manage Data
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Data Input</h3>
            <p className="text-gray-600 mb-4">Input new irrigation data</p>
            <a href="/admin/data/input" className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors text-center">
              Input Data
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}