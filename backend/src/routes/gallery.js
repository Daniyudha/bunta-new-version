const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;

    // Build where clause for filtering
    const where = { active: true };

    if (category && category !== 'All') {
      where.category = category;
    }

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;