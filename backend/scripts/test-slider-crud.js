const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSliderCRUD() {
  try {
    console.log('Testing Slider CRUD operations...');

    // Create a test slider
    const newSlider = await prisma.slider.create({
      data: {
        title: 'Test Slider',
        subtitle: 'Test Subtitle',
        image: 'https://via.placeholder.com/1200x600',
        link: 'https://example.com',
        order: 1,
        active: true,
      },
    });

    console.log('Created slider:', newSlider);

    // Read the slider
    const sliders = await prisma.slider.findMany();
    console.log('All sliders:', sliders);

    // Update the slider
    const updatedSlider = await prisma.slider.update({
      where: { id: newSlider.id },
      data: { title: 'Updated Test Slider' },
    });

    console.log('Updated slider:', updatedSlider);

    // Delete the slider
    const deletedSlider = await prisma.slider.delete({
      where: { id: newSlider.id },
    });

    console.log('Deleted slider:', deletedSlider);

    console.log('CRUD test completed successfully!');
  } catch (error) {
    console.error('Error during CRUD test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSliderCRUD();