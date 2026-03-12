const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Irrigation Updates', slug: 'irrigation-updates', description: 'Latest updates on irrigation infrastructure and systems' },
  { name: 'Agricultural News', slug: 'agricultural-news', description: 'News about agricultural practices and developments' },
  { name: 'Water Management', slug: 'water-management', description: 'Information about water resource management' },
  { name: 'Farmer Support', slug: 'farmer-support', description: 'Programs and support for local farmers' },
  { name: 'Technology', slug: 'technology', description: 'Technological advancements in irrigation' },
  { name: 'Events', slug: 'events', description: 'Upcoming events and workshops' },
  { name: 'Announcements', slug: 'announcements', description: 'Important announcements and notices' }
];

async function main() {
  console.log('Seeding categories...');
  
  // Create categories
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log(`Created category: ${category.name}`);
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });