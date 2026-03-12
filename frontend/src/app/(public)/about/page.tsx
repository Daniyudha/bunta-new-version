
export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Tentang Kantor Pengamatan Irigasi Bunta</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Berdedikasi untuk manajemen air berkelanjutan dan keunggulan irigasi di wilayah Bunta sejak 2010.
          </p>
        </div>

        {/* Office Profile Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Profil Kantor</h2>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Sejarah Daerah Irigasi Bunta</h3>
                <p className="text-gray-700 mb-4">
                  Daerah Irigasi Bunta merupakan sistem pengairan terpadu yang mencakup beberapa desa, yakni Desa Dwipakarya, Gonohop, Laonggo, Dowiwi, Koninis, Bombon, Rantau Jaya, Simpang Satu, Simpang Dua, Doda Bunta, dan Mantan A. Seluruh wilayah ini berada di Kecamatan Bunta dan Simpang Raya, Kabupaten Luwuk Banggai, Provinsi Sulawesi Tengah.
                </p>
                <p className="text-gray-700 mb-4">
                  Bendung Bunta merupakan bendung tetap yang dibangun dengan konstruksi batu kali. Bendung ini dirancang dengan sistem cascade, terdiri atas dua mercu: yaitu mercu utama tipe Ogee dan kolam olak tipe baket sebagai sistem pelindung energi aliran. Bendung Bunta memiliki fungsi vital dalam menunjang produktivitas pertanian, dengan cakupan areal irigasi potensial seluas 2.481 hektar. Sistem ini ditopang oleh kapasitas rencana saluran sekitar 6.000an meter kubik per detik.
                </p>
                <p className="text-gray-700 mb-4">
                  Bendung ini memiliki dimensi lebar total 66,70 meter, dengan lebar mercu mencapai 60 meter. Intake terdiri dari dua pintu, masing-masing berukuran 2,25 meter, mendukung kapasitas saluran utama. Penguras bendung memiliki dua pintu serupa, dengan pilar setebal 1 meter untuk kestabilan struktur. Sistem pembawa air terdiri dari enam jaringan saluran:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li>Saluran Induk Bunta sebanyak 5 ruas</li>
                  <li>Saluran Sekunder BD dengan 4 ruas</li>
                  <li>Sekunder BSD memiliki 3 ruas</li>
                  <li>Sekunder BL sebanyak 5 ruas</li>
                  <li>Sekunder BDS mencakup 5 ruas</li>
                  <li>Serta Sekunder BSP sebanyak 2 ruas</li>
                </ul>
                <p className="text-gray-700">
                  Keseluruhan sistem DI Bunta didukung oleh infrastruktur sebagai berikut: 1 bendung utama, 25 bangunan bagi dan sadap, 2 bangunan muka, 74 bangunan terjun, 3 buah talang, 8 gorong-gorong pembuang, 21 gorong-gorong jalan, 1 got miring untuk saluran efisiensi.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Wilayah Tanggung Jawab</h3>
                <p className="text-gray-700 mb-4">
                  Kami mencakup seluruh wilayah kecamatan Bunta-Simpang Raya, termasuk:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Kecamatan Bunta - Simpang Raya 2.481 hektar</li>
                  <li>Area pertanian yang terlewati</li>
                  <li>Area Bendung Bunta</li>
                  <li>Saluran Irigasi Primer, Sekunder, dan Tersier sepanjang 11 Km</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Visi & Misi</h2>
            
            {/* Vision */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Visi Kami</h3>
              <p className="text-blue-100 leading-relaxed max-w-2xl mx-auto">
                &quot;Terwujudnya Infrastruktur Cipta Karya dan Sumber Daya Air Yang Optimal Secara Berkelanjutan untuk Mendukung
                Sulawesi Tengah Lebih Sejahtera dan Lebih Maju&quot;
              </p>
            </div>

            {/* Mission */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Misi Kami</h3>
              <div className="text-blue-100 mx-auto max-w-2xl">
                <ol className="list-decimal list-outside space-y-3 pl-6 text-left">
                  <li className="pl-2 leading-tight">
                    Merumuskan kebijakan dan membina pelaksanaan operasional serta mengembangkan sistem pengelolaan bidang cipta karya dan sumber daya air secara holistik, sistematik, dan berkelanjutan.
                  </li>
                  <li className="pl-2 leading-tight">
                    Melakukan konservasi, pendayagunaan sumber daya air, pengendalian daya rusak air, pemberdayaan masyarakat, serta pengembangan sistem informasi sumber daya air.
                  </li>
                  <li className="pl-2 leading-tight">
                    Memberikan pelayanan secara optimal, efektif dan efisien pada masyarakat pengguna sumber daya air dalam rangka memenuhi semua kebutuhan air.
                  </li>
                  <li className="pl-2 leading-tight">
                    Peningkatan ketersediaan bangunan gedung.
                  </li>
                  <li className="pl-2 leading-tight">
                    Pembangunan dan Prasarana dan sarana permukiman.
                  </li>
                  <li className="pl-2 leading-tight">
                    Peningkatan pengawasan tertib bangunan gedung.
                  </li>
                  <li className="pl-2 leading-tight">
                    Peningkatan kualitas permukiman yang sehat, bersih, aman, nyaman, dan harmonis.
                  </li>
                  <li className="pl-2 leading-tight">
                    Melakukan perencanaan, pengawasan, monitoring dan evaluasi pemanfaatan bidang cipta karya dan sumber daya air.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Main Tasks Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-green-800 mb-8">Tugas & Fungsi Utama</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">💧</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Pengamatan Air</h3>
                <p className="text-gray-700 text-sm">
                  Pengamatan 24/7 level air, laju aliran, dan kualitas di semua saluran irigasi.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Analisis Data</h3>
                <p className="text-gray-700 text-sm">
                  Mengumpulkan dan menganalisis data irigasi untuk memberikan wawasan yang dapat ditindaklanjuti bagi petani.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">👨‍🌾</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Dukungan Petani</h3>
                <p className="text-gray-700 text-sm">
                  Bantuan teknis dan program pelatihan untuk petani tentang praktik terbaik irigasi.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🔄</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Pemeliharaan Infrastruktur</h3>
                <p className="text-gray-700 text-sm">
                  Pemeliharaan rutin dan peningkatan infrastruktur irigasi serta peralatan Pengamatan.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Perlindungan Lingkungan</h3>
                <p className="text-gray-700 text-sm">
                  Menerapkan praktik manajemen air berkelanjutan untuk melindungi ekosistem lokal.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Pelaporan</h3>
                <p className="text-gray-700 text-sm">
                  Pelaporan komprehensif kepada pemangku kepentingan dan instansi pemerintah tentang kinerja irigasi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Organization Structure Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-8">Struktur Organisasi</h2>
            <div className="bg-gray-100 rounded-lg p-6">
              {/* Top - Single Column */}
              <div className="text-center mb-8">
                <div className="bg-purple-600 text-white p-4 rounded-lg mx-auto max-w-md">
                  <h3 className="text-xl font-semibold">Pengamat</h3>
                  <p className="text-purple-100">Untung</p>
                </div>
              </div>

              {/* Middle - 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold text-green-800 mb-2">Juru Operasi dan Pemeliharaan</h4>
                  <p className="text-gray-700">Ahmad Fauzi Ridwan, A.Md.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold text-orange-800 mb-2">Staf Operasi</h4>
                  <p className="text-gray-700">Rahmatul Ummah</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold text-blue-800 mb-2">Staf Pemeliharaan</h4>
                  <p className="text-gray-700">Rahmat Hidayat</p>
                </div>
              </div>

              {/* Bottom - Single Column */}
              <div className="text-center">
                <div className="bg-gray-200 p-4 rounded-lg mx-auto max-w-md">
                  <h4 className="font-semibold text-gray-800 mb-1">Petugas Pintu Air dan Petugas Operasi Bendung</h4>
                  <p className="text-gray-700">11 Petugas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}