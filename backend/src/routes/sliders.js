const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;