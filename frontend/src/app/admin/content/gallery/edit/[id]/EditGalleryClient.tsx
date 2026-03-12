'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { galleryCategories } from '@/types/gallery';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  type: string;
  active: boolean;
  createdAt: string;
}

interface EditGalleryClientProps {
  id: string;
}

export default function EditGalleryClient({ id }: EditGalleryClientProps) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    type: 'image',
    active: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchGalleryItem();
    }
  }, [status, router, id]);

  const fetchGalleryItem = async () => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description || '',
          imageUrl: data.imageUrl,
          category: data.category,
          type: data.type,
          active: data.active,
        });

        // Set preview based on type
        if (data.type === 'image') {
          setImagePreview(data.imageUrl);
        } else if (data.type === 'video') {
          const youtubeId = extractYoutubeId(data.imageUrl);
          if (youtubeId) {
            setVideoPreviewUrl(`https://www.youtube.com/embed/${youtubeId}`);
          }
        }
      } else {
        setError('Failed to fetch gallery item');
      }
    } catch (error) {
      setError('Error fetching gallery item');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'type') {
      // Reset previews when type changes
      setImagePreview(null);
      setVideoPreviewUrl(null);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const uploadResult = await response.json();
          setImagePreview(uploadResult.url);
          setFormData(prev => ({ ...prev, imageUrl: uploadResult.url }));
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to upload image');
        }
      } catch (error) {
        setError('Error uploading image');
      } finally {
        setUploading(false);
      }
    }
  };

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle video preview when imageUrl changes for videos
  useEffect(() => {
    if (formData.type === 'video' && formData.imageUrl) {
      const youtubeId = extractYoutubeId(formData.imageUrl);
      if (youtubeId) {
        setVideoPreviewUrl(`https://www.youtube.com/embed/${youtubeId}`);
      } else {
        setVideoPreviewUrl(null);
      }
    } else if (formData.type === 'image') {
      setVideoPreviewUrl(null);
    }
  }, [formData.imageUrl, formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/content/gallery');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update gallery item');
      }
    } catch (error) {
      setError('Error updating gallery item');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Gallery</h1>
          <p className="text-gray-600 mt-2">Perbarui detail galeri</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan judul galeri"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deskripsi singkat tentang galeri"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipe *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Conditional rendering based on media type */}
            {formData.type === 'image' ? (
              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full file:px-3 file:py-2 file:cursor-pointer text-black file:bg-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={formData.type === 'image'}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                )}
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  required={formData.type === 'video'}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {videoPreviewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={videoPreviewUrl}
                        className="w-full h-48 rounded-md border"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {galleryCategories
                  .filter(category => category !== 'All')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Gallery Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}