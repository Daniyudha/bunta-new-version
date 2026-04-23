"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  MessageSquare,
  Building2,
  Users,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  User,
  FileText,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Google Maps embed URL
  const mapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5925.432192901917!2d119.89061965031289!3d-0.9151431909283918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8bee0373f66aa7%3A0xa9bee02b5d3e1394!2sDinas%20Cipta%20Karya%20dan%20Sumber%20Daya%20Air%20Prov.%20Sulawesi%20Tengah!5e1!3m2!1sen!2sid!4v1776967968331!5m2!1sen!2sid"`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form submitted successfully:", result);
        setSubmitStatus("success");
        reset();
      } else {
        console.error("Response status:", response.status, response.statusText);
        const responseText = await response.text();
        console.error("Raw server response:", responseText);

        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse error response as JSON:", parseError);
          errorData = {
            error: `Server error: ${response.status} ${response.statusText}`,
            rawResponse: responseText,
          };
        }
        console.error("Form submission failed:", errorData);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      content:
        "Jl. Prof. Dr. Moh. Yamin No.33,\nKota Palu, Sulawesi Tengah 94114",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "+62 821-9098-3281",
      color: "emerald",
      action: {
        label: "Hubungi via WhatsApp",
        href: "https://wa.me/6282190983281",
      },
    },
    {
      icon: Mail,
      title: "Email",
      content: "cikasda@sultengprov.go.id",
      color: "rose",
      action: {
        label: "Kirim Email",
        href: "mailto:cikasda@sultengprov.go.id",
      },
    },
    {
      icon: Clock,
      title: "Jam Kerja",
      content: "Senin - Jumat, 08:00 - 16:00 WITA",
      color: "amber",
    },
  ];

  const colorClasses: Record<
    string,
    {
      bg: string;
      iconBg: string;
      iconColor: string;
      border: string;
      gradient: string;
    }
  > = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      gradient: "from-blue-500 to-blue-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
      gradient: "from-emerald-500 to-emerald-600",
    },
    rose: {
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      border: "border-rose-200",
      gradient: "from-rose-500 to-rose-600",
    },
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      gradient: "from-amber-500 to-amber-600",
    },
  };

  const departments = [
    { name: "Dukungan Teknis", contact: "Untung", icon: HelpCircle },
    {
      name: "Hubungan Petani",
      contact: "Karyono (Gapuktan) & Supriyono (GP3A)",
      icon: Users,
    },
    {
      name: "Pertanyaan Data",
      contact: "Ahmad Fauzi Ridwan, A.Md.",
      icon: FileText,
    },
  ];

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
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-amber-200">
                Ada Pertanyaan?
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Hubungi Kami
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Hubungi Kantor UPT PSDA Wilayah II untuk pertanyaan, dukungan,
              atau masukan. Tim kami siap membantu Anda.
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
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info) => {
            const colors = colorClasses[info.color];
            return (
              <div
                key={info.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4`}
                >
                  <info.icon className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {info.content}
                </p>
                {info.action && (
                  <a
                    href={info.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-medium mt-3 ${colors.iconColor} hover:underline`}
                  >
                    {info.action.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Pesan Terkirim!</p>
              <p className="text-sm text-emerald-600">
                Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda
                kembali.
              </p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-800">Gagal Mengirim</p>
              <p className="text-sm text-red-600">
                Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi
                atau hubungi kami langsung.
              </p>
            </div>
          </div>
        )}

        {/* Main Content: Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Kirim Pesan
                  </h2>
                  <p className="text-sm text-gray-500">
                    Isi form di bawah ini untuk menghubungi kami
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        {...register("name", {
                          required: "Nama wajib diisi",
                          minLength: {
                            value: 2,
                            message: "Nama minimal 2 karakter",
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        {...register("email", {
                          required: "Email wajib diisi",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Alamat email tidak valid",
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan alamat email Anda"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subjek <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="subject"
                      {...register("subject", {
                        required: "Subjek wajib diisi",
                        minLength: {
                          value: 5,
                          message: "Subjek minimal 5 karakter",
                        },
                      })}
                      className={`w-full pl-10 pr-4 py-3 text-gray-700 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.subject
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                      placeholder="Masukkan subjek pesan Anda"
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register("message", {
                      required: "Pesan wajib diisi",
                      minLength: {
                        value: 10,
                        message: "Pesan minimal 10 karakter",
                      },
                    })}
                    className={`w-full px-4 py-3 text-gray-700 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.message
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Kontak Darurat
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Untuk masalah irigasi mendesak di luar jam kerja, silakan
                hubungi saluran darurat kami:
              </p>
              <a
                target="_blank"
                href="https://wa.me/6282190983281"
                className="inline-flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium w-full"
              >
                <Phone className="w-4 h-4" />
                +62 821-9098-3281 (WhatsApp)
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>

            {/* Departments */}
            {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Departemen</h3>
              </div>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.name} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <dept.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {dept.name}
                      </p>
                      <p className="text-xs text-gray-500">{dept.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-4">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Lokasi Kami
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Temukan Kantor Kami
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Kantor CIKASDA UPT PSDA Wilayah II berlokasi di Jl. Prof. Dr. Moh.
              Yamin No.33, Kota Palu, Sulawesi Tengah 94114 
            </p>
          </div>

          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-inner">
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kantor CIKASDA UPT PSDA Wilayah II"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Koordinat</p>
                <p className="text-xs text-gray-500">-0.9144182293127592, 119.89099421623234</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Akses</p>
                <p className="text-xs text-gray-500">
                  Dapat diakses melalui jalan utama dari pusat kota Palu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
