const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSliderColumns() {
  try {
    // Use raw SQL to check the structure of the sliders table
    const result = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'sliders' 
      AND TABLE_SCHEMA = DATABASE()
    `;
    
    console.log('Slider table columns:');
    console.table(result);

    // Also check if buttonText exists in the actual data
    const slidersWithButtonText = await prisma.slider.findMany({
      select: {
        id: true,
        title: true,
        buttonText: true
      }
    });
    
    console.log('\nSliders with buttonText:');
    console.table(slidersWithButtonText);

  } catch (error) {
    console.error('Error checking slider columns:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSliderColumns();