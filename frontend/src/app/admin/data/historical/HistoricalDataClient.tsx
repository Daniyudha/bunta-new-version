'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { WaterLevelData, RainfallData } from '@/types/data';

// Dynamically import chart components to reduce bundle size
const RainfallChart = dynamic(() => import('@/components/charts/RainfallChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

const WaterLevelChart = dynamic(() => import('@/components/charts/WaterLevelChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

interface ApiWaterLevelData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  createdAt: string;
}

interface ApiRainfallData {
  id: string;
  location: string;
  value: number;
  unit: string;
  measuredAt: string;
  createdAt: string;
}

interface CropData {
  id: string;
  crop: string;
  area: number;
  production: number;
  season: string;
  location: string | null;
  createdAt: string;
}

interface FarmerData {
  id: string;
  group: string;
  chairman: string;
  members: string[];
  createdAt: string;
}

type DataType = 'water-level' | 'rainfall' | 'crop' | 'farmer' | 'export';

export default function HistoricalDataClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DataType>('water-level');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waterLevelData, setWaterLevelData] = useState<ApiWaterLevelData[]>([]);
  const [rainfallData, setRainfallData] = useState<ApiRainfallData[]>([]);
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [farmerData, setFarmerData] = useState<FarmerData[]>([]);
  const [waterLevelChartData, setWaterLevelChartData] = useState<WaterLevelData[]>([]);
  const [rainfallChartData, setRainfallChartData] = useState<RainfallData[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');

    try {
      const [waterLevelResponse, rainfallResponse, cropResponse, farmerResponse] = await Promise.all([
        fetch('/api/admin/data/water-level', { credentials: 'include' }),
        fetch('/api/admin/data/rainfall', { credentials: 'include' }),
        fetch('/api/admin/data/crops', { credentials: 'include' }),
        fetch('/api/admin/farmers', { credentials: 'include' })
      ]);

      if (!waterLevelResponse.ok || !rainfallResponse.ok || !cropResponse.ok || !farmerResponse.ok) {
        setError('Failed to fetch some data');
        return;
      }

      const [waterLevelData, rainfallData, cropData, farmerResponseData] = await Promise.all([
        waterLevelResponse.json(),
        rainfallResponse.json(),
        cropResponse.json(),
        farmerResponse.json()
      ]);

      // Extract farmer data from the response structure { data: Farmer[], pagination: {...} }
      const farmerData = farmerResponseData.data || [];

      setWaterLevelData(waterLevelData);
      setRainfallData(rainfallData);
      setCropData(cropData);
      setFarmerData(farmerData);

      // Transform data for charts
      const transformedWaterLevelData: WaterLevelData[] = waterLevelData.map((item: ApiWaterLevelData) => ({
        date: new Date(item.measuredAt).toLocaleDateString('id-ID'),
        level: item.value,
        area: item.location
      }));

      const transformedRainfallData: RainfallData[] = rainfallData.map((item: ApiRainfallData) => ({
        date: new Date(item.measuredAt).toLocaleDateString('id-ID'),
        rainfall: item.value,
        area: item.location
      }));

      setWaterLevelChartData(transformedWaterLevelData);
      setRainfallChartData(transformedRainfallData);
    } catch (err) {
      setError('Error fetching historical data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Create a combined dataset for export
    const allData = {
      waterLevel: waterLevelData,
      rainfall: rainfallData,
      crops: cropData,
      farmers: farmerData
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'historical_data_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading historical data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'water-level':
        return <WaterLevelChart data={waterLevelChartData} />;
      case 'rainfall':
        return <RainfallChart data={rainfallChartData} />;
      case 'crop':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-black font-semibold mb-4">Crop Production History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area (Ha)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Production (Ton)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Season</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cropData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.crop}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.production}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.season}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'farmer':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-black font-semibold mb-4">Farmer Data History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kelompok</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketua</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Anggota</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Dibentuk</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farmerData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.group}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.chairman}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.members ? item.members.length : 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'export':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-black font-semibold mb-4">Export Historical Data</h3>
            <p className="text-gray-600 mb-6">Export all historical data for further analysis</p>
            <button
              onClick={handleExport}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Download Historical Data (JSON)
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'water-level' as DataType, name: 'Water Level History', color: 'blue' },
    { id: 'rainfall' as DataType, name: 'Rainfall History', color: 'green' },
    { id: 'crop' as DataType, name: 'Crop Production History', color: 'purple' },
    { id: 'farmer' as DataType, name: 'Farmer Data History', color: 'orange' },
    { id: 'export' as DataType, name: 'Export Data', color: 'teal' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Historical Data</h1>
          <p className="text-gray-600 mt-2">View and analyze historical data trends</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-600 text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chart/Data Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}