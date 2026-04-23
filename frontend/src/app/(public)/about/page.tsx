import {
  ShieldCheck,
  Eye,
  Target,
  Droplets,
  ChartBar,
  Sprout,
  RefreshCw,
  Globe,
  FileText,
  Star,
  Users,
} from "lucide-react";

const tugasItems = [
  {
    icon: Droplets,
    title: "Pengamatan Air",
    desc: "Pengamatan 24/7 level air, laju aliran, dan kualitas di semua saluran irigasi.",
    color: "blue",
  },
  {
    icon: ChartBar,
    title: "Analisis Data",
    desc: "Mengumpulkan dan menganalisis data irigasi untuk memberikan wawasan yang dapat ditindaklanjuti bagi petani.",
    color: "green",
  },
  {
    icon: Sprout,
    title: "Dukungan Petani",
    desc: "Bantuan teknis dan program pelatihan untuk petani tentang praktik terbaik irigasi.",
    color: "orange",
  },
  {
    icon: RefreshCw,
    title: "Pemeliharaan Infrastruktur",
    desc: "Pemeliharaan rutin dan peningkatan infrastruktur irigasi serta peralatan pengamatan.",
    color: "cyan",
  },
  {
    icon: Globe,
    title: "Perlindungan Lingkungan",
    desc: "Menerapkan praktik manajemen air berkelanjutan untuk melindungi ekosistem lokal.",
    color: "purple",
  },
  {
    icon: FileText,
    title: "Pelaporan",
    desc: "Pelaporan komprehensif kepada pemangku kepentingan dan instansi pemerintah tentang kinerja irigasi.",
    color: "yellow",
  },
];

const colorMap: Record<
  string,
  {
    bg: string;
    iconBg: string;
    iconColor: string;
    border: string;
    hover: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:border-blue-400",
  },
  green: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    border: "border-green-200",
    hover: "hover:border-green-400",
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    border: "border-orange-200",
    hover: "hover:border-orange-400",
  },
  cyan: {
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    border: "border-cyan-200",
    hover: "hover:border-cyan-400",
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    border: "border-purple-200",
    hover: "hover:border-purple-400",
  },
  yellow: {
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    border: "border-yellow-200",
    hover: "hover:border-yellow-400",
  },
};

export default function AboutPage() {
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
              <ShieldCheck className="w-4 h-4" />
              <span>Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              UPT PSDA Wilayah II
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Sulawesi Tengah
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
              Melaksanakan Pengembangan dan Pengelolaan Jaringan Irigasi dan
              Rawa, serta Pengelolaan dan Konservasi Sungai, Danau, Pantai dan
              Air Baku di Wilayah Provinsi Sulawesi Tengah.
            </p>
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

      {/* Office Profile Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1  items-center">
            {/* Left: Profile Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>Profil</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                UPT PSDA Wilayah II
              </h2>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  Unit Pelaksana Teknis Pengelolaan Sumber Daya Air (UPT PSDA)
                  Wilayah II merupakan bagian dari perangkat daerah Pemerintah
                  Provinsi Sulawesi Tengah yang memiliki peran strategis dalam
                  pengelolaan sumber daya air secara terpadu dan berkelanjutan
                  di wilayah kerjanya.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  UPT PSDA Wilayah II bertanggung jawab dalam melaksanakan
                  pengembangan serta pengelolaan jaringan irigasi dan rawa guna
                  mendukung ketahanan pangan dan peningkatan kesejahteraan
                  masyarakat, khususnya sektor pertanian. Selain itu, UPT ini
                  juga mengemban tugas dalam pengelolaan dan konservasi sumber
                  daya air yang meliputi sungai, danau, pantai, serta penyediaan
                  air baku sebagai kebutuhan dasar masyarakat dan pembangunan
                  daerah.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  Dalam menjalankan tugasnya, UPT PSDA Wilayah II berkomitmen
                  untuk menerapkan prinsip tata kelola sumber daya air yang
                  efektif, efisien, dan berwawasan lingkungan. Melalui
                  pendekatan teknis yang terintegrasi serta sinergi dengan
                  berbagai pemangku kepentingan, UPT ini berupaya menjaga
                  keseimbangan antara pemanfaatan dan pelestarian sumber daya
                  air.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                  Dengan semangat pelayanan publik yang profesional dan
                  inovatif, UPT PSDA Wilayah II terus berkontribusi dalam
                  mewujudkan pengelolaan sumber daya air yang berkelanjutan demi
                  mendukung pembangunan daerah dan meningkatkan kualitas hidup
                  masyarakat di wilayah Provinsi Sulawesi Tengah.
                </p>
              </div>
            </div>

            {/* Right: Stats Cards */}
            {/* <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">
                  Infrastruktur Bendung Wilayah II
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">66,70</div>
                    <div className="text-sm text-blue-200">Lebar Total (m)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">2.481</div>
                    <div className="text-sm text-blue-200">
                      Area Potensial (ha)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">6</div>
                    <div className="text-sm text-blue-200">
                      Jaringan Saluran
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">11</div>
                    <div className="text-sm text-blue-200">Desa Tercakup</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">
                  Jaringan Saluran
                </h4>
                <ul className="space-y-3">
                  {[
                    "Saluran Induk Bunta — 5 ruas",
                    "Saluran Sekunder BD — 4 ruas",
                    "Sekunder BSD — 3 ruas",
                    "Sekunder BL — 5 ruas",
                    "Sekunder BDS — 5 ruas",
                    "Sekunder BSP — 2 ruas",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>

          {/* Infrastructure Details */}
          {/* <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bendung Utama", value: "1", color: "blue" },
              { label: "Bangunan Bagi & Sadap", value: "25", color: "green" },
              { label: "Bangunan Muka", value: "2", color: "orange" },
              { label: "Bangunan Terjun", value: "74", color: "purple" },
              { label: "Talang", value: "3", color: "cyan" },
              { label: "Gorong-gorong Pembuang", value: "8", color: "yellow" },
              { label: "Gorong-gorong Jalan", value: "21", color: "rose" },
              { label: "Got Miring", value: "1", color: "emerald" },
            ].map((item) => {
              const colors = colorMap[item.color] || colorMap.blue;
              return (
                <div
                  key={item.label}
                  className={`${colors.bg} rounded-xl p-4 text-center border ${colors.border} hover:shadow-md transition-all duration-300`}
                >
                  <div
                    className={`text-2xl font-bold ${colors.iconColor} mb-1`}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div> */}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4" />
              <span>Visi & Misi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Arah dan Tujuan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami dalam mewujudkan pengelolaan sumber daya air yang
              optimal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="inline-flex p-3 bg-white/20 rounded-xl mb-5">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
              <p className="text-blue-100 leading-relaxed">
                &ldquo;Terwujudnya Infrastruktur Cipta Karya dan Sumber Daya Air
                Yang Optimal Secara Berkelanjutan untuk Mendukung Sulawesi
                Tengah Lebih Sejahtera dan Lebih Maju&rdquo;
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="inline-flex p-3 bg-orange-50 rounded-xl mb-5">
                <Target className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Misi Kami
              </h3>
              <ul className="space-y-3">
                {[
                  "Merumuskan kebijakan dan membina pelaksanaan operasional serta mengembangkan sistem pengelolaan bidang cipta karya dan sumber daya air secara holistik, sistematik, dan berkelanjutan.",
                  "Melakukan konservasi, pendayagunaan sumber daya air, pengendalian daya rusak air, pemberdayaan masyarakat, serta pengembangan sistem informasi sumber daya air.",
                  "Memberikan pelayanan secara optimal, efektif dan efisien pada masyarakat pengguna sumber daya air dalam rangka memenuhi semua kebutuhan air.",
                  "Peningkatan ketersediaan bangunan gedung, pembangunan prasarana dan sarana permukiman, serta pengawasan tertib bangunan gedung.",
                  "Peningkatan kualitas permukiman yang sehat, bersih, aman, nyaman, dan harmonis.",
                  "Melakukan perencanaan, pengawasan, monitoring dan evaluasi pemanfaatan bidang cipta karya dan sumber daya air.",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-orange-600">
                        {i + 1}
                      </span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tugas & Fungsi */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tugas & Fungsi Utama
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Peran dan tanggung jawab kami dalam mengelola sumber daya air.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tugasItems.map((item) => {
              const colors = colorMap[item.color];
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group ${colors.bg} rounded-2xl p-6 ${colors.border} ${colors.hover} border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl ${colors.iconBg} ${colors.iconColor} mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold mb-6">
              <Users className="w-4 h-4" />
              <span>Struktur Organisasi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Struktur Organisasi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bagan organisasi UPT PSDA Wilayah II.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Top - Kepala UPT */}
            <div className="text-center mb-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white">
                <span className="text-3xl font-bold text-white">M</span>
              </div>
              <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold">Kepala UPT PSDA Wilayah II</h3>
                <p className="text-purple-200 text-lg font-semibold mt-1">Mufliha Kamase, SE.,M.Si</p>
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-purple-200">
                  <span>Pembina (IV/a)</span>
                  <span className="hidden sm:inline">|</span>
                  <span>NIP: 197504242001122005</span>
                </div>
              </div>
              {/* Connector line */}
              <div className="w-0.5 h-8 bg-purple-300 mx-auto mt-4"></div>
              <div className="w-4 h-4 bg-purple-400 rounded-full mx-auto -mt-2"></div>
            </div>

            {/* Middle - 3 Columns (Horizontal connector) */}
            <div className="relative mb-8">
              <div className="absolute top-0 left-[16.67%] right-[16.67%] h-0.5 bg-purple-300 hidden md:block"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kabag Tata Usaha */}
                <div className="text-center">
                  <div className="w-0.5 h-6 bg-purple-300 mx-auto"></div>
                  <div className="group bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl font-bold text-white">S</span>
                    </div>
                    <h4 className="font-bold text-amber-700 mb-1">Kepala Sub Bagian Tata Usaha</h4>
                    <p className="text-gray-800 font-semibold">Sadriyani Anwar, S.P</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p className="bg-amber-50 rounded-lg px-3 py-1 inline-block">Penata Tingkat I (III/d)</p>
                      <p className="text-gray-400">NIP: 19830523 201001 2 010</p>
                    </div>
                  </div>
                </div>

                {/* Seksi Operasi dan Pemeliharaan */}
                <div className="text-center">
                  <div className="w-0.5 h-6 bg-purple-300 mx-auto"></div>
                  <div className="group bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl font-bold text-white">Z</span>
                    </div>
                    <h4 className="font-bold text-emerald-700 mb-1">Kepala Seksi Operasi dan Pemeliharaan</h4>
                    <p className="text-gray-800 font-semibold">Zuriaty Djaelangkara, S.T., M.Si</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p className="bg-emerald-50 rounded-lg px-3 py-1 inline-block">Pembina (IV/a)</p>
                      <p className="text-gray-400">NIP: 19810425 200212 2 004</p>
                    </div>
                  </div>
                </div>

                {/* Seksi Hidrologi dan SIM */}
                <div className="text-center">
                  <div className="w-0.5 h-6 bg-purple-300 mx-auto"></div>
                  <div className="group bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl font-bold text-white">N</span>
                    </div>
                    <h4 className="font-bold text-blue-700 mb-1">Kepala Seksi Hidrologi dan SIM</h4>
                    <p className="text-gray-800 font-semibold">Nyoman Resmiati, S.T., M.P.W</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p className="bg-blue-50 rounded-lg px-3 py-1 inline-block">Pembina (IV/a)</p>
                      <p className="text-gray-400">NIP: 19670910 199803 2 004</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom - Staff/Petugas */}
            <div className="text-center mt-10">
              <div className="w-0.5 h-6 bg-gray-300 mx-auto"></div>
              <div className="w-4 h-4 bg-gray-400 rounded-full mx-auto -mt-2 mb-6"></div>
              <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 px-10 py-5 rounded-2xl shadow-md max-w-md hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-gray-800 mb-1">
                  Petugas Pelaksana Teknis
                </h4>
                {/* <p className="text-gray-600">11 Petugas</p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
