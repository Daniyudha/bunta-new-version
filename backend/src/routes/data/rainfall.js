const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/data/rainfall
router.get('/', async (req, res) => {
  try {
    const rainfallData = await prisma.rainfallData.findMany({
      orderBy: { measuredAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    res.json(rainfallData);
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// GET /api/data/rainfall/count
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.rainfallData.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching rainfall data count:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;