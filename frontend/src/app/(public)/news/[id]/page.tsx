'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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
  const articleId = params.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${articleId}`);
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

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !article) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'The news article you&apos;re looking for doesn&apos;t exist.'}
          </p>
          <Link
            href="/news"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link href="/news" className="hover:text-blue-600">News</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <span className="text-gray-800">{article.title}</span>
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {article.image ? (
            <div className="h-100 bg-gray-200">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-white text-4xl">📰</span>
            </div>
          )}

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {article.category.name}
                </span>
                <span className="text-sm text-gray-500">{article.readTime || 5} min read</span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(article.createdAt)}</span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600">👤</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">By {article.author || 'Admin'}</p>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-8 text-black"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to News Link */}
            <div className="border-t border-gray-200 pt-6">
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                ← Back to News
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles - Temporarily removed as we need API endpoint for related articles */}
      </div>
    </div>
  );
}