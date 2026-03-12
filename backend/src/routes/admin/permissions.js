const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/permissions
router.get('/', async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
    });
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/permissions (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;