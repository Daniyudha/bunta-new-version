'use client';

import { useState, useEffect, useMemo } from 'react';
import Lightbox from '@/components/gallery/Lightbox';
import { galleryCategories, GalleryCategory } from '@/types/gallery';
import {
  Image, Video, Filter, CalendarDays,
  Camera, Play,
  AlertCircle, Grid3X3, Sparkles
} from 'lucide-react';

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

  const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  // Count stats
  const imageCount = galleryItems.filter(item => item.type === 'image').length;
  const videoCount = galleryItems.filter(item => item.type === 'video').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <div className="h-10 w-48 bg-white/20 rounded-full animate-pulse mx-auto mb-6"></div>
              <div className="h-16 w-96 bg-white/20 rounded-lg animate-pulse mx-auto mb-6"></div>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">Galeri</h1>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error loading gallery</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url("${heroPattern}")`, backgroundSize: '60px 60px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Camera className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">Dokumentasi Kegiatan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Galeri
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Jelajahi koleksi foto dan video yang menampilkan kegiatan irigasi, infrastruktur, 
              dan acara-acara di CIKASDA UPT PSDA Wilayah II Provinsi Sulawesi Tengah.
            </p>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60C360 60 360 30 720 30C1080 30 1080 0 1440 0V60H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">{galleryItems.length}</div>
                <div className="text-sm text-gray-600">Total Item</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Image className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-700">{imageCount}</div>
                <div className="text-sm text-gray-600">Foto</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-700">{videoCount}</div>
                <div className="text-sm text-gray-600">Video</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-700">{galleryCategories.length - 1}</div>
                <div className="text-sm text-gray-600">Kategori</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter Kategori</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category === 'All' ? 'Semua' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-500 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Menampilkan {filteredItems.length} item
            {selectedCategory !== 'All' && <span className="text-blue-600 font-medium"> dalam {selectedCategory}</span>}
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onClick={() => handleImageClick(item.imageUrl, item.type as 'image' | 'video')}
              >
                {/* Media Preview */}
                <div className="relative h-52 overflow-hidden">
                  {item.type === 'image' ? (
                    <div className="w-full h-full bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZpbGw9IiM5OTk5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-gray-900">
                      <iframe
                        src={getEmbedUrl(item.imageUrl)}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={(e) => {
                          console.error('Failed to load video:', item.imageUrl);
                          const iframe = e.currentTarget as HTMLIFrameElement;
                          iframe.style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'flex items-center justify-center h-full text-red-500';
                          errorDiv.innerHTML = 'Failed to load video';
                          iframe.parentNode?.appendChild(errorDiv);
                        }}
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-gray-900 ml-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm ${
                      item.type === 'image' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-rose-500 text-white'
                    }`}>
                      {item.type === 'image' ? (
                        <><Image className="w-3 h-3" /> Foto</>
                      ) : (
                        <><Video className="w-3 h-3" /> Video</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(item.date)}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results Message */
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada gambar ditemukan</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Coba pilih kategori lain untuk melihat lebih banyak konten.
            </p>
          </div>
        )}

      </div>

      {/* Lightbox - placed outside relative z-20 wrapper to prevent stacking context conflict with Header (z-50) */}
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
  );
}
