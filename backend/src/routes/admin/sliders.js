const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/sliders
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, image, link, buttonText, order, active } = req.body;

    // Validate required fields
    if (!title || !image) {
      return res.status(400).json({ message: 'Title and image are required' });
    }

    const slider = await prisma.slider.create({
      data: {
        title,
        subtitle: subtitle || null,
        image,
        link: link || null,
        buttonText: buttonText || 'Pelajari Lebih Lanjut',
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });

    res.status(201).json(slider);
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;