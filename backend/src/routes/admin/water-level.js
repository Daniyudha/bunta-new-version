const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/admin/data/water-level
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = location ? { location: { contains: location } } : {};

    const [waterLevelData, totalCount] = await Promise.all([
      prisma.waterLevelData.findMany({
        where,
        orderBy: { measuredAt: 'desc' },
        skip,
        take,
      }),
      prisma.waterLevelData.count({ where }),
    ]);

    res.json({
      data: waterLevelData,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error('Error fetching water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/water-level
router.post('/', async (req, res) => {
  try {
    const { location, value, unit, measuredAt } = req.body;

    if (!location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'Location, value, and measuredAt are required',
      });
    }

    // TODO: get user ID from session
    const recordedBy = 'admin';

    const waterLevelData = await prisma.waterLevelData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
        recordedBy,
      },
    });

    res.status(201).json(waterLevelData);
  } catch (error) {
    console.error('Error creating water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/water-level
router.put('/', async (req, res) => {
  try {
    const { id, location, value, unit, measuredAt } = req.body;

    if (!id || !location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'ID, location, value, and measuredAt are required',
      });
    }

    const updatedData = await prisma.waterLevelData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/water-level
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.waterLevelData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;