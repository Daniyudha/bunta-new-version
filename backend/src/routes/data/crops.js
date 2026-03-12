const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/data/crops
router.get('/', async (req, res) => {
  try {
    const cropData = await prisma.cropData.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    res.json(cropData);
  } catch (error) {
    console.error('Error fetching crop data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

module.exports = router;