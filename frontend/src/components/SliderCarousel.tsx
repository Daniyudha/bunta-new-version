'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

interface Slider {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  buttonText: string | null;
  order: number;
  active: boolean;
}

export default function SliderCarousel() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/sliders');
      if (!response.ok) {
        throw new Error('Failed to fetch sliders');
      }
      const data = await response.json();
      setSliders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative bg-gray-200 h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || sliders.length === 0) {
    return (
      <section
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sistem Irigasi Bunta
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Informasi lengkap manajemen air dan irigasi untuk petani dan pemangku kepentingan di wilayah Bunta.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-screen"
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slider.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
                <div className="text-center text-white flex flex-col items-center justify-center w-full">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slider.title}
                  </h1>
                  {slider.subtitle && (
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                      {slider.subtitle}
                    </p>
                  )}
                  {slider.link && (
                    <Link
                      href={slider.link}
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
                    >
                      {slider.buttonText || 'Pelajari Lebih Lanjut'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}