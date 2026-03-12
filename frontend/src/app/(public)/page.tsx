import SliderCarousel from '@/components/SliderCarousel';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider Carousel */}
      <SliderCarousel />


      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Layanan Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Pemantauan Level Air</h3>
              <p className="text-gray-600">
                Pemantauan real-time level air di saluran irigasi dengan analisis data historis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Analisis Data</h3>
              <p className="text-gray-600">
                Analisis data komprehensif dan visualisasi untuk pengambilan keputusan yang tepat dalam manajemen air.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Dukungan Petani</h3>
              <p className="text-gray-600">
                Dukungan dan sumber daya khusus untuk petani dalam mengoptimalkan irigasi dan meningkatkan hasil panen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Petani Dilayani</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">2.481</div>
              <div className="text-gray-600">Hektar Tercover</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Pemantauan</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">30+</div>
              <div className="text-gray-600">Tahun Beroperasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ada Keluhan Dengan Jaringan Irigasi Kami?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Diskusikan dengan kami untuk mendapatkan pelayanan yang baik dan andal.
          </p>
          <a href="http://wa.me/6289696862326" target="_blank" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-400 hover:text-white cursor-pointer transition duration-300">
            Mulai Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
