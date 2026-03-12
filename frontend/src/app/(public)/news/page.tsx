'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newsCategories, NewsCategory } from '@/types/news';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: {
    name: string;
  };
  createdAt: string;
  published: boolean;
  author?: string;
  readTime?: number;
  tags?: string[];
}

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      // Initial load uses full page loading, subsequent uses grid loading
      const isInitialLoad = currentPage === 1 && selectedCategory === 'All' && searchQuery === '';
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setGridLoading(true);
      }
      setFetchError(null);
      
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(selectedCategory !== 'All' && { category: selectedCategory }),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`/api/news?${params}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data.news);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.totalItems);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setFetchError(errorData.message || 'Failed to fetch news');
          console.error('Failed to fetch news:', response.status, errorData);
        }
      } catch (error) {
        setFetchError('Network error. Please check your connection.');
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
        setGridLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, selectedCategory, searchQuery]);

  // Use articles directly from API (already filtered)
  const currentArticles = articles;

  const handleCategoryChange = (category: NewsCategory) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Berita & Artikel</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Memuat artikel berita...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Berita & Artikel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tetap update dengan berita terbaru, pengumuman, dan artikel tentang manajemen irigasi dan perkembangan pertanian.
          </p>
          <div className="w-full md:w-1/3 mt-8 text-center mx-auto">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-2">
                {newsCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {totalItems} artikel{totalItems !== 1 ? '' : ''}
            {selectedCategory !== 'All' && ` dalam ${selectedCategory}`}
            {searchQuery && ` untuk "${searchQuery}"`}
          </p>
        </div>

        {fetchError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {gridLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentArticles && currentArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {article.image ? (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <span className="text-white text-2xl">📰</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue-600 font-medium">{article.category.name}</span>
                      <span className="text-sm text-gray-500">5 menit baca</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{formatDate(article.createdAt)}</div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Oleh Admin</span>
                      <Link
                        href={`/news/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Baca Selengkapnya →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || gridLoading}
                  className="px-4 py-2 text-black bg-white shadow-2xl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 cursor-pointer"
                >
                  Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={gridLoading}
                    className={`px-4 py-2 rounded-lg ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || gridLoading}
                  className="px-4 py-2 text-black bg-white shadow-2xl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 cursor-pointer"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Results Message */
          <div className="text-center py-46">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-gray-600">
              Coba sesuaikan pencarian atau kriteria filter untuk menemukan yang Anda cari.
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Tetap Update</h2>
          <p className="text-gray-700 mb-4">
            Berlangganan newsletter kami untuk menerima berita dan pembaruan terbaru langsung di inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Masukkan alamat email Anda"
              className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Berlangganan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}