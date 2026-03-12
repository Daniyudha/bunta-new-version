const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/data/water-level
router.get('/', async (req, res) => {
  try {
    const waterLevelData = await prisma.waterLevelData.findMany({
      orderBy: { measuredAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    res.json(waterLevelData);
  } catch (error) {
    console.error('Error fetching water level data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// GET /api/data/water-level/count
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.waterLevelData.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching water level data count:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;