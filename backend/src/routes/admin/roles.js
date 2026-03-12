const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/roles
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/roles (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;