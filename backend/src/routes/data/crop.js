const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/data/crop/count
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.cropData.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching crop data count:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;