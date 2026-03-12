'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminContent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Konten</h1>
          <p className="text-gray-600 mt-2">Kelola artikel berita, halaman, dan konten website</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Artikel Berita</h3>
            <p className="text-gray-600 mb-4">Buat dan kelola konten berita</p>
            <Link href="/admin/content/news" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center">
              Kelola Berita
            </Link>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">Galeri</h3>
            <p className="text-gray-600 mb-4">Unggah dan kelola gambar</p>
            <Link href="/admin/content/gallery" className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors text-center">
              Kelola Galeri
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">Slider/Spanduk</h3>
            <p className="text-gray-600 mb-4">Kelola slider halaman utama</p>
            <Link href="/admin/content/sliders" className="block w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors text-center">
              Kelola Slider
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-teal-600">Kategori</h3>
            <p className="text-gray-600 mb-4">Kelola kategori konten</p>
            <Link href="/admin/content/categories" className="block w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors text-center">
              Kelola Kategori
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}