const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

// GET /api/admin/farmers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { group: { contains: search } },
        { chairman: { contains: search } },
      ],
    } : {};

    const [farmers, totalCount] = await Promise.all([
      prisma.farmer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          name: true,
          group: true,
          chairman: true,
          members: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.farmer.count({ where }),
    ]);

    // Parse members JSON
    const farmersWithParsedMembers = farmers.map(farmer => {
      try {
        const membersData = farmer.members;
        if (Array.isArray(membersData)) {
          return { ...farmer, members: membersData };
        }
        if (typeof membersData === 'string') {
          const parsed = JSON.parse(membersData);
          return { ...farmer, members: Array.isArray(parsed) ? parsed : [] };
        }
        return { ...farmer, members: [] };
      } catch (parseError) {
        return { ...farmer, members: [] };
      }
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      data: farmersWithParsedMembers,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/farmers
router.post('/', async (req, res) => {
  try {
    const { name, group, chairman, members } = req.body;

    if (!name || !group || !chairman || !members) {
      return res.status(400).json({
        message: 'Name, group, chairman, and members are required',
      });
    }

    // Ensure members is an array
    let membersArray = [];
    if (Array.isArray(members)) {
      membersArray = members;
    } else if (typeof members === 'string') {
      membersArray = members.split(',').map(m => m.trim()).filter(m => m !== '');
    } else {
      return res.status(400).json({
        message: 'Members must be an array or comma-separated string',
      });
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        group,
        chairman,
        members: membersArray,
      },
    });

    res.status(201).json(farmer);
  } catch (error) {
    console.error('Error creating farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/farmers
router.put('/', async (req, res) => {
  try {
    const { id, name, group, chairman, members } = req.body;

    if (!id || !name || !group || !chairman || !members) {
      return res.status(400).json({
        message: 'ID, name, group, chairman, and members are required',
      });
    }

    let membersArray = [];
    if (Array.isArray(members)) {
      membersArray = members;
    } else if (typeof members === 'string') {
      membersArray = members.split(',').map(m => m.trim()).filter(m => m !== '');
    } else {
      return res.status(400).json({
        message: 'Members must be an array or comma-separated string',
      });
    }

    const updatedFarmer = await prisma.farmer.update({
      where: { id },
      data: {
        name,
        group,
        chairman,
        members: membersArray,
      },
    });

    res.json(updatedFarmer);
  } catch (error) {
    console.error('Error updating farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/farmers
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.farmer.delete({
      where: { id },
    });

    res.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;