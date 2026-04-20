const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/admin/data/rainfall
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = location ? { location: { contains: location } } : {};

    const [rainfallData, totalCount] = await Promise.all([
      prisma.rainfallData.findMany({
        where,
        orderBy: { measuredAt: 'desc' },
        skip,
        take,
      }),
      prisma.rainfallData.count({ where }),
    ]);

    res.json({
      data: rainfallData,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/rainfall
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

    const rainfallData = await prisma.rainfallData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
        recordedBy,
      },
    });

    res.status(201).json(rainfallData);
  } catch (error) {
    console.error('Error creating rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/rainfall
router.put('/', async (req, res) => {
  try {
    const { id, location, value, unit, measuredAt } = req.body;

    if (!id || !location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'ID, location, value, and measuredAt are required',
      });
    }

    const updatedData = await prisma.rainfallData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/rainfall
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.rainfallData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;