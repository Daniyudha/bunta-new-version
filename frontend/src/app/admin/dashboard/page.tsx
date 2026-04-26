'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' }, cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchDashboardStats() {
  // Fetch all counts in parallel using existing endpoints
  const [newsData, galleryData, usersData, rainfallCount, waterLevelCount, cropsData, farmersData] = await Promise.all([
    fetchJson(`${BACKEND_URL}/api/admin/news?limit=1`),     // returns { totalCount, ... }
    fetchJson(`${BACKEND_URL}/api/admin/gallery?limit=1`),   // returns { pagination: { total, ... } }
    fetchJson(`${BACKEND_URL}/api/admin/users`),              // returns array
    fetchJson(`${BACKEND_URL}/api/data/rainfall/count`),      // returns { count }
    fetchJson(`${BACKEND_URL}/api/data/water-level/count`),   // returns { count }
    fetchJson(`${BACKEND_URL}/api/data/crops`),               // returns array
    fetchJson(`${BACKEND_URL}/api/data/farmers`),             // returns array
  ]);

  return {
    newsCount: newsData?.totalCount ?? 0,
    galleryCount: galleryData?.pagination?.total ?? 0,
    userCount: Array.isArray(usersData) ? usersData.length : 0,
    rainfallCount: rainfallCount?.count ?? 0,
    waterLevelCount: waterLevelCount?.count ?? 0,
    cropCount: Array.isArray(cropsData) ? cropsData.length : 0,
    farmerCount: Array.isArray(farmersData) ? farmersData.length : 0,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { newsCount, userCount, galleryCount, rainfallCount, waterLevelCount, cropCount, farmerCount } = await fetchDashboardStats();

  const dataEntriesCount = rainfallCount + waterLevelCount + cropCount + farmerCount;

  const stats = {
    totalContacts: 0,
    newsArticles: newsCount,
    pendingMessages: 0,
    activeUsers: userCount,
    galleryItems: galleryCount,
    dataEntries: dataEntriesCount,
  };

  const recentActivity = [
    {
      type: 'content',
      icon: '📰',
      title: 'New article published',
      time: '2 minutes ago',
      colorClass: 'bg-green-100 text-green-800 border-green-200',
    },
    {
      type: 'security',
      icon: '👤',
      title: 'User login',
      time: '15 minutes ago',
      colorClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      type: 'data',
      icon: '📊',
      title: 'Data import completed',
      time: '1 hour ago',
      colorClass: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Selamat datang di panel administrasi Sistem Irigasi Bunta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">✉️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalContacts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Kontak</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📰</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.newsArticles}</div>
              <div className="text-sm text-gray-600">Artikel Berita</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">✉️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingMessages}</div>
              <div className="text-sm text-gray-600">Pesan Tertunda</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
              <div className="text-sm text-gray-600">Pengguna Aktif</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🖼️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.galleryItems}</div>
              <div className="text-sm text-gray-600">Item Galeri</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.dataEntries}</div>
              <div className="text-sm text-gray-600">Entri Data</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Aksi Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/admin/content/news/create" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white">📝</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-blue-800">Buat Berita</div>
                  <div className="text-sm text-blue-600">Terbitkan artikel baru</div>
                </div>
              </a>

              <a href="/admin/data/input" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white">💧</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-green-800">Input Data</div>
                  <div className="text-sm text-green-600">Data ketinggian air</div>
                </div>
              </a>

              <a href="/admin/contact-submissions" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white">✉️</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-yellow-800">Pesan Kontak</div>
                  <div className="text-sm text-yellow-600">Kelola submission</div>
                </div>
              </a>

              <a href="/admin/content/gallery/create" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white">🖼️</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-purple-800">Tambah Galeri</div>
                  <div className="text-sm text-purple-600">Upload gambar baru</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                let iconBgClass = 'bg-gray-100';
                let iconTextClass = 'text-gray-600';

                if (activity.type === 'content') {
                  iconBgClass = 'bg-green-100';
                  iconTextClass = 'text-green-600';
                } else if (activity.type === 'security') {
                  iconBgClass = 'bg-blue-100';
                  iconTextClass = 'text-blue-600';
                } else if (activity.type === 'data') {
                  iconBgClass = 'bg-purple-100';
                  iconTextClass = 'text-purple-600';
                }

                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${iconBgClass} rounded-full flex items-center justify-center mr-3`}>
                        <span className={`${iconTextClass} text-sm`}>{activity.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {activity.title
                            .replace('New article published', 'Artikel baru diterbitkan')
                            .replace('User login', 'Login pengguna')
                            .replace('Data import completed', 'Impor data selesai')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.time
                            .replace('minutes ago', 'menit yang lalu')
                            .replace('hour ago', 'jam yang lalu')}
                        </p>
                      </div>
                    </div>
                    <span className={`${activity.colorClass} text-xs px-2 py-1 rounded-full capitalize`}>
                      {activity.type
                        .replace('content', 'konten')
                        .replace('security', 'keamanan')
                        .replace('data', 'data')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Status Sistem</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server API</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Basis Data</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Terhubung</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Penyimpanan</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">2.3GB/1000GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Backup Terakhir</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Hari ini 08:00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tautan Cepat</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 text-black bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Dokumentasi
              </button>
              <button className="w-full text-left p-3 text-black bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Pusat Dukungan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
