'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SimpleModal from '@/components/ui/SimpleModal';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactSubmissionsClient() {
  const { status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubmissions();
    }
  }, [status]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/contact-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        setError('Failed to fetch contact submissions');
      }
    } catch {
      setError('Error fetching contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSuccessMessage('Status berhasil diperbarui');
        fetchSubmissions(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update status');
      }
    } catch {
      setError('Error updating status');
    }
  };

  const handleViewMessage = (submission: ContactSubmission) => {
    console.log('Viewing message:', submission);
    setSelectedSubmission(submission);
    setShowModal(true);
    if (submission.status === 'unread') {
      updateStatus(submission.id, 'read');
    }
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  // Close modal and reset selectedSubmission
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Belum Dibaca';
      case 'read':
        return 'Sudah Dibaca';
      case 'replied':
        return 'Sudah Dibalas';
      default:
        return status;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kontak Submissions</h1>
            <p className="text-gray-600 mt-2">Kelola semua submission kontak dari pengunjung</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dikirim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEmailClick(submission.email)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {submission.email}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        submission.status
                      )}`}
                    >
                      {getStatusText(submission.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewMessage(submission)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Lihat
                    </button>
                    <select
                      value={submission.status}
                      onChange={(e) => updateStatus(submission.id, e.target.value)}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300"
                    >
                      <option value="unread">Belum Dibaca</option>
                      <option value="read">Sudah Dibaca</option>
                      <option value="replied">Sudah Dibalas</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada submission kontak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      <SimpleModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedSubmission ? `Pesan dari ${selectedSubmission.name}` : 'Pesan'}
      >
        {selectedSubmission ? (
          <div className="space-y-4">
            <div className="text-black">
              <strong>Nama:</strong> {selectedSubmission.name}
            </div>
            <div className="text-black">
              <strong>Email:</strong>{' '}
              <button
                onClick={() => handleEmailClick(selectedSubmission.email)}
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {selectedSubmission.email}
              </button>
            </div>
            <div className="text-black">
              <strong>Subjek:</strong> {selectedSubmission.subject}
            </div>
            <div className="text-black">
              <strong>Dikirim:</strong>{' '}
              {new Date(selectedSubmission.createdAt).toLocaleString()}
            </div>
            <div className="text-black">
              <strong>Status:</strong>{' '}
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                selectedSubmission.status
              )}`}>
                {getStatusText(selectedSubmission.status)}
              </span>
            </div>
            <div className="border-t border-black text-black pt-4 mt-4">
              <strong>Pesan:</strong>
              <div className="mt-2 p-3 bg-gray-100 rounded-md whitespace-pre-wrap text-black">
                {selectedSubmission.message}
              </div>
            </div>
          </div>
        ) : (
          <div>Memuat...</div>
        )}
      </SimpleModal>
    </div>
  );
}