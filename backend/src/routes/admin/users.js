const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            news: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/users (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;