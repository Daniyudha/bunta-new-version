'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Newspaper,
  ArrowLeft,
  Clock,
  User,
  CalendarDays,
  Tag,
  Share2,
  Eye,
  ChevronRight,
  Home,
} from 'lucide-react';

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

export default function NewsArticlePage() {
  const params = useParams();
  const articleSlug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${articleSlug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (articleSlug) {
      fetchArticle();
    }
  }, [articleSlug]);

  const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-10 w-48 bg-white/20 rounded-full animate-pulse mx-auto mb-6" />
              <div className="h-16 w-96 bg-white/20 rounded-lg animate-pulse mx-auto mb-6" />
              <div className="h-8 w-2/3 bg-white/20 rounded-lg animate-pulse mx-auto" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F9FAFB" />
            </svg>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-72 bg-gray-200" />
            <div className="p-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Newspaper className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-amber-200">Berita</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  Artikel Tidak Ditemukan
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                {error || 'Artikel yang Anda cari tidak tersedia.'}
              </p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Berita
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F9FAFB" />
            </svg>
          </div>
        </section>
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
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Newspaper className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">
                Detail Berita
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                {article.title}
              </span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {formatDate(article.createdAt)}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime || 5} menit membaca
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author || 'Admin'}
              </span>
            </div>
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
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li>
              <Link href="/news" className="hover:text-blue-600 transition-colors">
                Berita
              </Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
          {/* Featured Image */}
          {article.image ? (
            <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {/* Category Badge Overlay */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full shadow-lg">
                  <Newspaper className="w-3.5 h-3.5" />
                  {article.category.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
              <Newspaper className="w-20 h-20 text-white/30" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold rounded-full shadow-lg">
                  <Newspaper className="w-3.5 h-3.5" />
                  {article.category.name}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-10">
            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{article.readTime || 5} menit membaca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" />
                <span>{article.author || 'Admin'}</span>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author Card */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author || 'Admin'}</p>
                <p className="text-sm text-gray-500">Penulis</p>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-8 text-gray-700
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
                prose-strong:text-gray-900
                prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-li:marker:text-blue-500"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share & Navigation */}
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Berita
              </Link>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link berita telah disalin!');
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles Placeholder */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Artikel Terkait</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Jelajahi berita dan artikel lainnya seputar pengelolaan sumber daya air di wilayah kami.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Lihat Semua Berita
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
