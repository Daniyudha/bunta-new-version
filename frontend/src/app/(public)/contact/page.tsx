'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Google Maps embed URL
  const mapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d956.4111068714739!2d122.21546773010013!3d-0.8689575518802887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwNTInMDguNyJTIDEyMsKwMTInNTcuNCJF!5e0!3m2!1sen!2sid!4v1757283599798!5m2!1sen!2sid"`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        setSubmitStatus('success');
        reset();
      } else {
        console.error('Response status:', response.status, response.statusText);
        // Get the raw response text to see what the server is returning
        const responseText = await response.text();
        console.error('Raw server response:', responseText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          errorData = {
            error: `Server error: ${response.status} ${response.statusText}`,
            rawResponse: responseText
          };
        }
        console.error('Form submission failed:', errorData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hubungi Kantor Pemantauan Irigasi Bunta untuk pertanyaan, dukungan, atau masukan.
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda kembali.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi atau hubungi kami langsung.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Informasi Kantor</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">Alamat</h3>
                <p className="text-gray-600">
                  Satuan Pemukiman B, Simpang Raya, <br />
                  Kabupaten Banggai, Sulawesi Tengah <br />
                  Indonesia
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">Detail Kontak</h3>
                <p className="text-gray-600">
                  <strong>Telepon:</strong> +62 896-9686-2326<br />
                  <strong>Email:</strong> irigasibunta@gmail.com<br />
                  <strong>Jam Kerja:</strong> Senin-Jumat, 08:00 - 16:00
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">Kontak Darurat</h3>
                <p className="text-gray-600">
                  Untuk masalah irigasi mendesak di luar jam kerja, silakan hubungi saluran darurat kami:
                  <a target="_blank" href="https://wa.me/6289696862326" className="text-green-700 hover:text-green-500">
                    +62 896-9686-2326 (Klik Chat Whatsapp)
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">Departemen</h3>
                <p className="text-gray-600">
                  <strong>Dukungan Teknis:</strong> Untung<br />
                  <strong>Hubungan Petani:</strong> Karyono (Gapuktan) & Supriyono(GP3A)<br />
                  <strong>Pertanyaan Data:</strong> Ahmad Fauzi Ridwan, A.Md.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Kirim Pesan kepada Kami</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', {
                    required: 'Nama wajib diisi',
                    minLength: {
                      value: 2,
                      message: 'Nama minimal 2 karakter'
                    }
                  })}
                  className={`w-full px-4 py-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Masukkan nama lengkap Anda"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Alamat email tidak valid'
                    }
                  })}
                  className={`w-full px-4 py-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Masukkan alamat email Anda"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject', {
                    required: 'Subjek wajib diisi',
                    minLength: {
                      value: 5,
                      message: 'Subjek minimal 5 karakter'
                    }
                  })}
                  className={`w-full px-4 py-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Masukkan subjek pesan Anda"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', {
                    required: 'Pesan wajib diisi',
                    minLength: {
                      value: 10,
                      message: 'Pesan minimal 10 karakter'
                    }
                  })}
                  className={`w-full px-4 py-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Masukkan pesan Anda di sini..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  'Kirim Pesan'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Lokasi Kami</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kantor Pemantauan Irigasi Bunta"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Koordinat:</strong> -1.3891° N, 121.6139° E
              </div>
              <div>
                <strong>Akses:</strong> Dapat diakses melalui jalan utama dari pusat kota Bunta
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}