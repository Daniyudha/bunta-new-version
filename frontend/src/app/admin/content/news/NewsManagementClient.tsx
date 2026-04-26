"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, X, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

interface News {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: {
    name: string;
  } | null;
}

export default function NewsManagementClient() {
  const { status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchNews = useCallback(
    async (page = currentPage, query = debouncedSearchQuery) => {
      try {
        setError("");
        const url = new URL("/api/admin/news", window.location.origin);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", itemsPerPage.toString());
        if (query) {
          url.searchParams.append("search", query);
        }

        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          setNews(data.news || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalCount || 0);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.message || "Failed to fetch news");
        }
      } catch (error) {
        setError("Network error: Unable to fetch news");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage, debouncedSearchQuery],
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetchNews();
    }
  }, [status, fetchNews]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch news when debounced search query or page changes
  useEffect(() => {
    if (status === "authenticated") {
      fetchNews(currentPage, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, currentPage, status, fetchNews]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNews(news.filter((item) => item.id !== id));
      } else {
        setError("Failed to delete news");
      }
    } catch (error) {
      setError("Error deleting news");
    }
  };

  const handlePublish = async (id: string, publish: boolean) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: publish }),
      });

      if (response.ok) {
        fetchNews(); // Refresh the list
      } else {
        setError("Failed to update news");
      }
    } catch (error) {
      setError("Error updating news");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manajemen Berita
            </h1>
            <p className="text-gray-600 mt-2">Tulis dan kelola berita.</p>
          </div>
          <Link
            href="/admin/content/news/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Berita Baru
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex items-center justify-between mx-3">
            {/* Results Info */}
            <div className="px-6 py-4 ">
              <p className="text-sm text-gray-600">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} sd{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} dari{" "}
                {totalItems} hasil
                {searchQuery && (
                  <span>
                    {" "}
                    for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </span>
                )}
              </p>
            </div>
            {/* Search Form */}
            <div className="px-6 py-4 md:w-1/3">
              <div className="bg-white rounded-lg border border-gray-300">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari berita berdasarkan judul, slug, or konten..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full text-black pl-10 pr-12 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500">{item.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => handlePublish(item.id, !item.published)}
                      className={`inline-flex items-center justify-center p-2 rounded transition cursor-pointer ${
                        item.published
                          ? "text-yellow-600 hover:bg-yellow-500/10"
                          : "text-green-600 hover:bg-green-500/10"
                      }`}
                      title={item.published ? "Unpublish" : "Publish"}
                    >
                      {item.published ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <Link
                      href={`/admin/content/news/edit/${item.id}`}
                      className="inline-flex items-center justify-center p-2 rounded text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center p-2 rounded text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {news.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? "Tidak ditemukan artikel berita yang sesuai dengan pencarian Anda."
                : "Tidak ada artikel berita yang ditemukan. Buat artikel pertama Anda!"}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-black cursor-pointer bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-black cursor-pointer text-sm bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
