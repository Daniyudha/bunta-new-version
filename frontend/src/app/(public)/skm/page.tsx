import {
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  ChevronRight,
  Send,
  Star,
  HeartHandshake,
} from "lucide-react";

type ColorKey = "amber" | "rose" | "emerald";

interface SKMCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: ColorKey;
  features: string[];
}

const skmCategories: SKMCategory[] = [
  {
    id: "saran",
    title: "Saran",
    description:
      "Berikan saran terbaik Anda untuk membantu kami mengembangkan dan meningkatkan kualitas layanan irigasi di wilayah Sulawesi Tengah.",
    icon: Lightbulb,
    href: "https://bit.ly/SKM_Cikasda",
    color: "amber",
    features: [
      "Pengembangan infrastruktur",
      "Peningkatan pelayanan",
      "Inovasi teknologi",
      "Efisiensi operasional",
    ],
  },
  {
    id: "kritik",
    title: "Kritik",
    description:
      "Sampaikan kritik membangun Anda agar kami dapat mengevaluasi dan memperbaiki kekurangan dalam pelayanan yang kami berikan.",
    icon: MessageCircle,
    href: "https://bit.ly/SKM_Cikasda",
    color: "rose",
    features: [
      "Kualitas pelayanan",
      "Responsivitas petugas",
      "Sarana & prasarana",
      "Sistem Informasi",
    ],
  },
  {
    id: "masukan",
    title: "Masukan",
    description:
      "Bagikan masukan dan ide-ide kreatif Anda untuk mendukung kemajuan pengelolaan sumber daya air yang lebih baik dan berkelanjutan.",
    icon: ThumbsUp,
    href: "https://bit.ly/SKM_Cikasda",
    color: "emerald",
    features: [
      "Kebijakan & regulasi",
      "Program kerja",
      "Kolaborasi & partnership",
      "Keberlanjutan lingkungan",
    ],
  },
];

const colorMap: Record<ColorKey, {
  bg: string;
  border: string;
  hover: string;
  icon: string;
  badge: string;
  button: string;
  gradient: string;
  light: string;
}> = {
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    hover: "hover:border-amber-400",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    button: "bg-amber-500 hover:bg-amber-600",
    gradient: "from-amber-500 to-orange-500",
    light: "bg-amber-50/50",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    hover: "hover:border-rose-400",
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    button: "bg-rose-500 hover:bg-rose-600",
    gradient: "from-rose-500 to-pink-500",
    light: "bg-rose-50/50",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hover: "hover:border-emerald-400",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-500 hover:bg-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50/50",
  },
};

export default function SKMPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjLTEuMSAwLTItLjktMi0ydi00YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00em0wLTIwaC00Yy0xLjEgMC0yLS45LTItMnYtNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMnoiLz48cGF0aCBkPSJNMjAgMzRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTR6bTAtMTBoLTRjLTEuMS0uOS0yLTIuOS0yLTR2LTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Saran, Kritik, dan Masukan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Suara Anda
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Membangun Perubahan
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Kami percaya bahwa setiap saran, kritik, dan masukan dari Anda
              adalah langkah awal menuju pelayanan yang lebih baik. Bersama,
              kita wujudkan pengelolaan irigasi yang unggul dan berkelanjutan.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#saran"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Send className="w-4 h-4" />
                Berikan Masukan
              </a>
              <a
                href="#informasi"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <HeartHandshake className="w-4 h-4" />
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="relative group">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                1,200+
              </div>
              <div className="text-gray-600">Masukan Terekap</div>
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            <div className="relative group">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">
                95%
              </div>
              <div className="text-gray-600">Telah Ditindaklanjuti</div>
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-amber-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            <div className="relative group">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                4.8/5
              </div>
              <div className="text-gray-600">Indeks Kepuasan</div>
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-emerald-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            <div className="relative group">
              <div className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Kritik & Saran</div>
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-rose-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-20 bg-gray-50" id="saran">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Kategori Masukan Anda
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setiap pendapat Anda sangat berarti bagi kami. Pilih kategori yang
              sesuai dengan keperluan Anda untuk mulai memberikan masukan.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skmCategories.map((category) => {
              const colors = colorMap[category.color];
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className={`group relative ${colors.bg} rounded-2xl ${colors.border} ${colors.hover} border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className="p-8 pb-6">
                    <div
                      className={`inline-flex p-3 rounded-xl ${colors.icon} mb-4`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="px-8 pb-6">
                    <div className="space-y-2">
                      {category.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-500"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${colors.button}`}
                          ></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer / CTA */}
                  <div className="px-8 pb-8">
                    <a
                      href={category.href}
                      target="_blank"
                      className={`inline-flex items-center justify-center gap-2 w-full ${colors.button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg group/btn`}
                    >
                      <span>Isi Form {category.title}</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </a>
                  </div>

                  {/* Decorative Corner */}
                  <div
                    className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${colors.light} opacity-50 group-hover:scale-150 transition-transform duration-500`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why SKM Matters Section */}
      <section className="py-20 bg-white" id="informasi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <HeartHandshake className="w-4 h-4" />
                <span>Mengapa SKM Penting?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Bersama Membangun{" "}
                <span className="text-blue-600">Pelayanan Prima</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Program Saran, Kritik, dan Masukan (SKM) merupakan wujud
                komitmen kami untuk terus mendengarkan dan melibatkan masyarakat
                dalam setiap langkah perbaikan layanan irigasi. Setiap masukan
                yang Anda berikan akan kami analisis dan tindaklanjuti secara
                berkala.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Lightbulb,
                    title: "Inovasi Berkelanjutan",
                    desc: "Masukan Anda menjadi inspirasi untuk inovasi layanan yang lebih baik.",
                  },
                  {
                    icon: MessageCircle,
                    title: "Transparansi Penuh",
                    desc: "Setiap kritik dan saran akan kami publikasikan perkembangannya secara berkala.",
                  },
                  {
                    icon: Star,
                    title: "Penghargaan Partisipasi",
                    desc: "Setiap kontribusi Anda adalah bagian dari kemajuan bersama yang kami hargai.",
                  },
                ].map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                        <ItemIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Illustration / Stats */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">
                  Alur Penanganan Masukan
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      step: "01",
                      title: "Masukan Disampaikan",
                      desc: "Melalui formulir SKM yang telah disediakan",
                    },
                    {
                      step: "02",
                      title: "Verifikasi & Klasifikasi",
                      desc: "Tim kami memverifikasi dan mengelompokkan masukan",
                    },
                    {
                      step: "03",
                      title: "Analisis & Tindak Lanjut",
                      desc: "Masukan dianalisis dan ditindaklanjuti oleh unit terkait",
                    },
                    {
                      step: "04",
                      title: "Evaluasi & Pelaporan",
                      desc: "Hasil tindak lanjut dievaluasi dan dilaporkan secara berkala",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-blue-200">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-30 -z-10"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-30 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Memberikan Masukan?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Setiap langkah kecil Anda hari ini akan membawa perubahan besar bagi
            pengelolaan irigasi di Sulawesi Tengah. Mari bersama kita wujudkan
            pelayanan yang lebih baik.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {skmCategories.map((category) => {
              const colors = colorMap[category.color];
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href={category.href}
                  target="_blank"
                  className={`inline-flex items-center gap-2 ${colors.button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                >
                  <Icon className="w-5 h-5" />
                  <span>Isi {category.title}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
