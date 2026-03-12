const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/storage
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [files, total] = await Promise.all([
      prisma.fileStorage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.fileStorage.count({ where })
    ]);

    res.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/storage (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'File upload not implemented yet' });
});

module.exports = router;