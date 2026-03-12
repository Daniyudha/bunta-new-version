'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, AlignJustify } from 'lucide-react';


interface FileStorage {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string | null;
  description: string | null;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function StoragePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<FileStorage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchFiles();
    }
  }, [session, pagination.page, search, category]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(category && { category })
      });

      const response = await fetch(`/api/storage?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFiles(data.files);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch files:', data.error);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (category) formData.append('category', category);

    try {
      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('File berhasil diunggah!');
        fetchFiles(); // Refresh the list
      } else {
        alert(`Upload gagal: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload gagal. Silakan coba lagi.');
    } finally {
      setUploading(false);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleDownload = async (file: FileStorage) => {
    try {
      const response = await fetch(`/api/storage/${file.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Download gagal');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download gagal');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;

    try {
      const response = await fetch(`/api/storage/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('File berhasil dihapus');
        fetchFiles(); // Refresh the list
      } else {
        const data = await response.json();
        alert(`Hapus gagal: ${data.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Hapus gagal');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, size = 'text-4xl') => {
    if (mimeType.includes('image')) return <span className={size}>🖼️</span>;
    if (mimeType.includes('video')) return <span className={size}>🎬</span>;
    if (mimeType.includes('audio')) return <span className={size}>🎵</span>;
    if (mimeType.includes('pdf')) return <span className={size}>📄</span>;
    if (mimeType.includes('word') || mimeType.includes('document')) return <span className={size}>📝</span>;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return <span className={size}>📦</span>;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <span className={size}>📊</span>;
    return <span className={size}>📄</span>;
  };

  const renderFilePreview = (file: FileStorage) => {
    if (file.mimeType.includes('image')) {
      return (
        <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={file.url}
            alt={file.originalName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    if (file.mimeType.includes('video')) {
      return (
        <div className="w-full h-40 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          <span className="text-6xl text-white z-10">🎬</span>
          <div className="absolute bottom-2 left-2 z-10">
            <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Video</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
        {getFileIcon(file.mimeType, 'text-6xl')}
      </div>
    );
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Penyimpanan Arsip Data</h1>
          <p className="text-gray-600">Kelola dan atur file Anda di penyimpanan cloud</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl text-black font-semibold mb-4">Unggah File Baru</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-1">
              <input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-full file:cursor-pointer file:px-3 file:py-2 file:bg-gray-300 text-black border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md"
              >
                <option value="">Pilih Kategori (opsional)</option>
                <option value="documents">Documents</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
                <option value="audio">Audio</option>
                <option value="archives">Archives</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <button
                onClick={handleFileUpload}
                disabled={uploading || !selectedFile}
                className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Mengunggah...' : 'Unggah'}
              </button>
            </div>
            {uploading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Mengunggah...</span>
              </div>
            )}
          </div>
          {selectedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                File terpilih: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
              </p>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Cari file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-md"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 text-black border border-gray-300 rounded-md"
            >
              <option value="">Semua Kategori</option>
              <option value="documents">Documents</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="audio">Audio</option>
              <option value="archives">Archives</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-md cursor-pointer ${
                  layout === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="List view"
              >
                <AlignJustify size={20} />
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-md cursor-pointer ${
                  layout === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Files List/Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat file...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Tidak ada file ditemukan</p>
            </div>
          ) : layout === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ukuran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getFileIcon(file.mimeType)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {file.originalName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {file.mimeType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                        >
                          Unduh
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  {/* File Preview */}
                  <div className="relative">
                    {renderFilePreview(file)}
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-medium text-white bg-black bg-opacity-70 px-2 py-1 rounded-full">
                        {file.category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                  
                  {/* File Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm truncate" title={file.originalName}>
                        {file.originalName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{file.mimeType}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Unduh
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                  {pagination.total} file
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}