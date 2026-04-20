const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/irrigation-profiles
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ],
    } : {};

    const [profiles, totalCount] = await Promise.all([
      prisma.irrigationProfile.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.irrigationProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      data: profiles,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching irrigation profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/irrigation-profiles
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      latitude,
      longitude,
      area,
      waterLevel,
      status,
      canals,
      gates,
      waterSource,
    } = req.body;

    if (!name || !area) {
      return res.status(400).json({ message: 'Name and area are required' });
    }

    const profile = await prisma.irrigationProfile.create({
      data: {
        name,
        description: description || '',
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        area: parseFloat(area),
        waterLevel: waterLevel ? parseFloat(waterLevel) : null,
        status: status || 'normal',
        canals: canals ? parseInt(canals) : null,
        gates: gates ? parseInt(gates) : null,
        waterSource: waterSource || null,
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/irrigation-profiles
router.put('/', async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      location,
      latitude,
      longitude,
      area,
      waterLevel,
      status,
      canals,
      gates,
      waterSource,
    } = req.body;

    if (!id || !name || !area) {
      return res.status(400).json({ message: 'ID, name, and area are required' });
    }

    const updatedProfile = await prisma.irrigationProfile.update({
      where: { id },
      data: {
        name,
        description: description || '',
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        area: parseFloat(area),
        waterLevel: waterLevel ? parseFloat(waterLevel) : null,
        status: status || 'normal',
        canals: canals ? parseInt(canals) : null,
        gates: gates ? parseInt(gates) : null,
        waterSource: waterSource || null,
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/irrigation-profiles
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    await prisma.irrigationProfile.delete({
      where: { id },
    });

    res.json({ message: 'Irrigation profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;