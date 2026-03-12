const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/irrigation-profiles - public endpoint
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      search = '', 
      status = '',
      location = '' 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { waterSource: { contains: search } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (location) {
      where.location = { contains: location };
    }

    const [profiles, totalCount] = await Promise.all([
      prisma.irrigationProfile.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' },
        ],
        skip,
        take,
      }),
      prisma.irrigationProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      profiles,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    console.error('Error fetching irrigation profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/irrigation-profiles/:id - public endpoint
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.irrigationProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Irrigation profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;