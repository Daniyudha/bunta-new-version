const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateNewsCategories() {
  try {
    console.log('Updating news articles with proper categories...');

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat.id;
    });

    // Update each news article with a appropriate category
    const newsArticles = await prisma.news.findMany();
    
    for (const article of newsArticles) {
      let newCategoryId;
      
      // Assign categories based on article content or title
      if (article.title.toLowerCase().includes('irrigation')) {
        newCategoryId = categoryMap['irrigation updates'];
      } else if (article.title.toLowerCase().includes('agricultural') || article.title.toLowerCase().includes('rainfall')) {
        newCategoryId = categoryMap['agricultural news'];
      } else if (article.title.toLowerCase().includes('water')) {
        newCategoryId = categoryMap['water management'];
      } else if (article.title.toLowerCase().includes('support') || article.title.toLowerCase().includes('program')) {
        newCategoryId = categoryMap['farmer support'];
      } else if (article.title.toLowerCase().includes('technology') || article.title.toLowerCase().includes('iot')) {
        newCategoryId = categoryMap['technology'];
      } else if (article.title.toLowerCase().includes('workshop') || article.title.toLowerCase().includes('festival')) {
        newCategoryId = categoryMap['events'];
      } else {
        // Default to Announcements
        newCategoryId = categoryMap['announcements'];
      }

      if (newCategoryId) {
        await prisma.news.update({
          where: { id: article.id },
          data: { categoryId: newCategoryId },
        });
        console.log(`Updated article "${article.title}" with category ID: ${newCategoryId}`);
      }
    }

    console.log('News articles updated successfully!');
  } catch (error) {
    console.error('Error updating news categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateNewsCategories();