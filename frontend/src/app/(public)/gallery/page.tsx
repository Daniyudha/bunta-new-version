'use client';

import { useState, useEffect, useMemo } from 'react';
import Lightbox from '@/components/gallery/Lightbox';
import { galleryCategories, GalleryCategory } from '@/types/gallery';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  type: string;
  date: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageType, setSelectedImageType] = useState<'image' | 'video'>('image');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getEmbedUrl = (url: string): string => {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryItems(data);
        } else {
          setError('Failed to fetch gallery items');
        }
      } catch {
        setError('Error fetching gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter items based on category
  const filteredItems = useMemo(() => {
    return selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter(item => item.category === selectedCategory);
  }, [selectedCategory, galleryItems]);

  const handleImageClick = (imageUrl: string, type: 'image' | 'video') => {
    setSelectedImage(imageUrl);
    setSelectedImageType(type);
    const index = filteredItems.findIndex(item => item.imageUrl === imageUrl);
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setSelectedImageIndex(-1);
  };

  const handleNext = () => {
    if (selectedImageIndex < filteredItems.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      const nextItem = filteredItems[nextIndex];
      setSelectedImage(nextItem.imageUrl);
      setSelectedImageType(nextItem.type as 'image' | 'video');
      setSelectedImageIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      const prevItem = filteredItems[prevIndex];
      setSelectedImage(prevItem.imageUrl);
      setSelectedImageType(prevItem.type as 'image' | 'video');
      setSelectedImageIndex(prevIndex);
    }
  };

  const getSelectedImageData = () => {
    if (!selectedImage) return null;
    return galleryItems.find(item => item.imageUrl === selectedImage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error loading gallery</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Galeri</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi koleksi foto kami yang menampilkan kegiatan irigasi, infrastruktur, dan acara lainnya.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Menampilkan {filteredItems.length} item{filteredItems.length !== 1 ? '' : ''}
            {selectedCategory !== 'All' && ` dalam ${selectedCategory}`}
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => handleImageClick(item.imageUrl, item.type as 'image' | 'video')}
              >
                {item.type === 'image' ? (
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                    <iframe
                      src={getEmbedUrl(item.imageUrl)}
                      className="w-full h-48 rounded-md border"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={(e) => {
                        console.error('Failed to load video:', item.imageUrl);
                        const iframe = e.currentTarget as HTMLIFrameElement;
                        iframe.style.display = 'none';
                        // Show error message
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'flex items-center justify-center h-full text-red-500';
                        errorDiv.innerHTML = 'Failed to load video';
                        iframe.parentNode?.appendChild(errorDiv);
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results Message */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada gambar ditemukan</h3>
            <p className="text-gray-600">
              Coba pilih kategori lain untuk melihat lebih banyak konten.
            </p>
          </div>
        )}

        {/* Lightbox */}
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          imageUrl={selectedImage || ''}
          title={getSelectedImageData()?.title || ''}
          description={getSelectedImageData()?.description || ''}
          type={selectedImageType}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedImageIndex < filteredItems.length - 1}
          hasPrev={selectedImageIndex > 0}
        />
      </div>
    </div>
  );
}
