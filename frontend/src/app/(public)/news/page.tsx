"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { newsCategories, NewsCategory } from "@/types/news";
import {
  Newspaper,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  ArrowRight,
  Mail,
  Send,
  Tag,
  CalendarDays,
  FileText,
  RefreshCw,
} from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const isInitialLoad =
        currentPage === 1 && selectedCategory === "All" && searchQuery === "";
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
          ...(selectedCategory !== "All" && { category: selectedCategory }),
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
          setFetchError(errorData.message || "Failed to fetch news");
          console.error("Failed to fetch news:", response.status, errorData);
        }
      } catch (error) {
        setFetchError("Network error. Please check your connection.");
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
        setGridLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, selectedCategory, searchQuery]);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-10 w-48 bg-white/20 rounded-full animate-pulse mx-auto mb-6"></div>
              <div className="h-16 w-96 bg-white/20 rounded-lg animate-pulse mx-auto mb-6"></div>
              <div className="h-8 w-2/3 bg-white/20 rounded-lg animate-pulse mx-auto"></div>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("${heroPattern}")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Newspaper className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">
                Informasi Terkini
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Berita & Artikel
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Tetap update dengan berita terbaru, pengumuman, dan artikel
              tentang CIKASDA UPT PSDA Wilayah II Provinsi Sulawesi Tengah.
            </p>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 60C360 60 360 30 720 30C1080 30 1080 0 1440 0V60H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {newsCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {category === "All" ? "Semua" : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Menampilkan {totalItems} artikel
            {selectedCategory !== "All" && (
              <span className="text-blue-600 font-medium">
                {" "}
                dalam {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="text-amber-600 font-medium">
                {" "}
                untuk &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </p>
        </div>

        {/* Error State */}
        {fetchError && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
            <p className="text-red-700 font-medium mb-3">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Grid Loading */}
        {gridLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
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
        )}

        {/* Articles Grid */}
        {!gridLoading && currentArticles && currentArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-full shadow-sm">
                        {article.category.name}
                      </span>
                    </div>
                    {/* Date Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime || 5} menit baca
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More */}
                    <Link
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group/link"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || gridLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={gridLoading}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || gridLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : !gridLoading ? (
          /* No Results Message */
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tidak ada artikel ditemukan
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Coba sesuaikan pencarian atau kriteria filter untuk menemukan yang
              Anda cari.
            </p>
          </div>
        ) : null}

        {/* Newsletter Subscription */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 shadow-xl mt-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("${heroPattern}")`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Tetap Update
              </h2>
              <p className="text-blue-200 mb-8 max-w-xl mx-auto">
                Berlangganan newsletter kami untuk menerima berita dan pembaruan
                terbaru langsung di inbox Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Masukkan alamat email Anda"
                    className="w-full pl-10 pr-4 py-3 text-gray-700 bg-white rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
                <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                  <Send className="w-4 h-4" />
                  Berlangganan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
