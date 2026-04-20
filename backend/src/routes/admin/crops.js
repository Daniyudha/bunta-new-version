const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/admin/data/crops
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (location) {
      where.location = { contains: location };
    }
    if (search) {
      where.OR = [
        { crop: { contains: search } },
        { season: { contains: search } },
      ];
    }

    const [cropData, totalCount] = await Promise.all([
      prisma.cropData.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.cropData.count({ where }),
    ]);

    res.json({
      data: cropData,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/crops
router.post('/', async (req, res) => {
  try {
    const { crop, area, production, season, location } = req.body;

    if (!crop || area === undefined || production === undefined || !season) {
      return res.status(400).json({
        message: 'Crop, area, production, and season are required',
      });
    }

    // TODO: get user ID from session
    const recordedBy = 'admin';

    const cropData = await prisma.cropData.create({
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
        recordedBy,
      },
    });

    res.status(201).json(cropData);
  } catch (error) {
    console.error('Error creating crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/crops
router.put('/', async (req, res) => {
  try {
    const { id, crop, area, production, season, location } = req.body;

    if (!id || !crop || area === undefined || production === undefined || !season) {
      return res.status(400).json({
        message: 'ID, crop, area, production, and season are required',
      });
    }

    const updatedData = await prisma.cropData.update({
      where: { id },
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/crops
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.cropData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;