const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('Checking categories...');
    const categories = await prisma.category.findMany();
    console.log('Categories:', categories);

    console.log('\nChecking news articles...');
    const news = await prisma.news.findMany({
      include: {
        category: true,
        author: true
      }
    });
    console.log('News articles:', news);

    console.log('\nChecking if any news articles are published...');
    const publishedNews = await prisma.news.findMany({
      where: { published: true },
      include: { category: true }
    });
    console.log('Published news:', publishedNews);
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();