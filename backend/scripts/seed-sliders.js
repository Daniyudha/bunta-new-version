const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleSliders() {
  try {
    // Delete any existing sliders to start fresh
    await prisma.slider.deleteMany();
    console.log('Cleared existing sliders');

    // Create sample slider data with internal links and buttonText
    const sampleSliders = [
      {
        title: 'Selamat Datang di Sistem Irigasi Bunta',
        subtitle: 'Layanan informasi manajemen air terpadu untuk petani',
        image: '/images/hero-bg.jpeg',
        link: '/data',
        buttonText: 'Lihat Data Air',
        order: 1,
        active: true
      },
      {
        title: 'Pemantauan Real-time Level Air',
        subtitle: 'Pantau kondisi air irigasi secara langsung dan akurat',
        image: '/images/water-monitoring.jpg',
        link: '/irrigation',
        buttonText: 'Pelajari Sistem',
        order: 2,
        active: true
      },
      {
        title: 'Dukungan untuk Petani Lokal',
        subtitle: 'Tingkatkan hasil panen dengan manajemen irigasi yang tepat',
        image: '/images/farmer-support.jpg',
        link: '/contact',
        buttonText: 'Hubungi Kami',
        order: 3,
        active: true
      }
    ];

    for (const sliderData of sampleSliders) {
      const slider = await prisma.slider.create({
        data: sliderData
      });
      console.log('Created slider:', slider.title);
    }

    console.log('Sample sliders created successfully!');
  } catch (error) {
    console.error('Error creating sample sliders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleSliders();