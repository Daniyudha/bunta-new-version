import Link from "next/link";
import {
  ChevronRight,
  Droplets,
  BarChart3,
  Sprout,
  Waves,
  Users,
  PenSquare,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import SliderCarousel from "@/components/SliderCarousel";

const layananItems = [
  {
    icon: Droplets,
    title: "Pemantauan Level Air",
    desc: "Monitoring level air secara real-time pada saluran irigasi dengan dukungan data historis untuk memahami kondisi dan tren.",
    color: "blue",
    href: "/data",
  },
  {
    icon: BarChart3,
    title: "Analisis Data",
    desc: "Pengolahan dan visualisasi data irigasi untuk membantu pengambilan keputusan yang lebih tepat dan efisien.",
    color: "green",
    href: "/data",
  },
  {
    icon: Sprout,
    title: "Dukungan Petani",
    desc: "Penyediaan informasi dan panduan praktis bagi petani untuk mengoptimalkan penggunaan air dan hasil pertanian.",
    color: "orange",
    href: "/farmers",
  },
  {
    icon: Waves,
    title: "Pengelolaan Sumber Daya Air",
    desc: "Pengaturan distribusi air secara terintegrasi untuk memastikan penggunaan yang efisien dan merata.",
    color: "cyan",
    href: "/irrigation",
  },
  {
    icon: Users,
    title: "Pengelolaan Kepegawaian",
    desc: "Pengelolaan data pegawai meliputi penempatan, kinerja, dan administrasi untuk mendukung operasional yang tertata.",
    color: "purple",
    href: "/kepegawaian",
  },
  {
    icon: PenSquare,
    title: "Pelaporan & Dokumentasi",
    desc: "Penyusunan laporan dan dokumentasi kegiatan irigasi secara sistematis untuk memudahkan monitoring dan evaluasi.",
    color: "yellow",
    href: "/news",
  },
];

const colorMapLayanan: Record<
  string,
  {
    bg: string;
    iconBg: string;
    iconColor: string;
    border: string;
    hover: string;
    shadow: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:border-blue-400",
    shadow: "shadow-blue-100",
  },
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    border: "border-green-200",
    hover: "hover:border-green-400",
    shadow: "shadow-green-100",
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    border: "border-orange-200",
    hover: "hover:border-orange-400",
    shadow: "shadow-orange-100",
  },
  cyan: {
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    border: "border-cyan-200",
    hover: "hover:border-cyan-400",
    shadow: "shadow-cyan-100",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    border: "border-purple-200",
    hover: "hover:border-purple-400",
    shadow: "shadow-purple-100",
  },
  yellow: {
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    border: "border-yellow-200",
    hover: "hover:border-yellow-400",
    shadow: "shadow-yellow-100",
  },
};

const statsData = [
  { value: "100+", label: "Petani Dilayani", color: "blue" },
  { value: "15+", label: "Daerah Irigasi Terkelola", color: "green" },
  { value: "24/7", label: "Pemantauan", color: "orange" },
  { value: "20+", label: "Tahun Beroperasi", color: "purple" },
];

const statColors: Record<
  string,
  { text: string; bar: string; dot: string }
> = {
  blue: { text: "text-blue-600", bar: "bg-blue-200", dot: "bg-blue-500" },
  green: { text: "text-green-600", bar: "bg-green-200", dot: "bg-green-500" },
  orange: {
    text: "text-orange-600",
    bar: "bg-orange-200",
    dot: "bg-orange-500",
  },
  purple: {
    text: "text-purple-600",
    bar: "bg-purple-200",
    dot: "bg-purple-500",
  },
};

const nilaiItems = [
  {
    icon: ShieldCheck,
    title: "Transparan",
    desc: "Seluruh data dan informasi dikelola secara terbuka dan dapat diakses oleh publik.",
  },
  {
    icon: Star,
    title: "Akurat",
    desc: "Data dan informasi yang disajikan selalu diperbarui dan diverifikasi keakuratannya.",
  },
  {
    icon: Users,
    title: "Kolaboratif",
    desc: "Bekerja sama dengan berbagai pihak untuk hasil yang optimal dan berkelanjutan.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider Carousel */}
      <SliderCarousel />

      {/* Welcome Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Selamat Datang di Cikasda</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              UPT PSDA Wilayah II
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Sulawesi Tengah
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unit Pelaksana Teknis Pengelolaan Sumber Daya Air yang berkomitmen
              dalam pengelolaan irigasi dan sumber daya air secara profesional,
              akurat, dan berkelanjutan untuk kemakmuran masyarakat.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Tentang Kami</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/irrigation"
                className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
              >
                <span>Profil Irigasi</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Kami Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip yang menjadi landasan kami dalam memberikan pelayanan
              terbaik kepada masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nilaiItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
                >
                  <div className="inline-flex p-4 bg-blue-50 rounded-xl text-blue-600 mb-5 group-hover:bg-blue-100 transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Layanan Kami Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjLTEuMSAwLTItLjktMi0ydi00YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00em0wLTIwaC00Yy0xLjEgMC0yLS45LTItMnYtNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMnoiLz48cGF0aCBkPSJNMjAgMzRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTR6bTAtMTBoLTRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai layanan unggulan kami dalam pengelolaan sumber daya air
              dan irigasi untuk mendukung produktivitas pertanian.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layananItems.map((item) => {
              const colors = colorMapLayanan[item.color];
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group ${colors.bg} rounded-2xl p-6 ${colors.border} ${colors.hover} border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl ${colors.iconBg} ${colors.iconColor}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span>Pelajari Lebih Lanjut</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dampak Kami
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Angka yang mencerminkan dedikasi dan komitmen kami dalam
              mengelola sumber daya air di Sulawesi Tengah.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat) => {
              const colors = statColors[stat.color];
              return (
                <div key={stat.label} className="relative group text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-b from-white to-gray-300 text-transparent bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                  {/* Animated bar */}
                  <div
                    className={`absolute bottom-0 left-1/4 right-1/4 h-0.5 ${colors.bar} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                  >
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${colors.dot} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feedback & Complaints Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Kami Mendengarkan Anda</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Suara Anda{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Membangun Perubahan
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
              Setiap masukan, keluhan, dan saran Anda adalah bahan bakar untuk
              perubahan yang lebih baik. Pilih saluran yang sesuai dengan
              kebutuhan Anda.
            </p>
          </div>

          {/* Two Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1: Complaints */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-red-400/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-red-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Ada Keluhan?</h3>
                  <p className="text-blue-200 text-sm">
                    Laporkan masalah yang Anda hadapi
                  </p>
                </div>
              </div>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Jika Anda mengalami masalah atau ketidaknyamanan dengan
                pelayanan kami, jangan ragu untuk menghubungi kami melalui
                WhatsApp. Tim kami siap membantu menyelesaikan masalah Anda
                dengan cepat dan tepat.
              </p>
              <a
                href="http://wa.me/6282190983281"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg group/btn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                <span>Hubungi Via WhatsApp</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

            {/* Card 2: SKM Feedback */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-amber-400/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-amber-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Saran, Kritik & Masukan
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Bantu kami meningkatkan pelayanan
                  </p>
                </div>
              </div>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Kami sangat menghargai saran, kritik, dan masukan dari Anda. Isi
                formulir SKM (Saran, Kritik, dan Masukan) untuk berkontribusi
                dalam pengembangan layanan irigasi yang lebih baik dan
                berkelanjutan.
              </p>
              <Link
                href="/skm"
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg group/btn"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Lihat Halaman SKM</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center mt-10">
            <p className="text-blue-200 text-sm">
              Setiap masukan akan ditindaklanjuti dalam waktu 1x24 jam kerja.
              Partisipasi Anda sangat berarti bagi kami.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
