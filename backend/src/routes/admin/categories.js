const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/categories
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    } : {};

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.category.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages,
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/categories
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const category = await prisma.category.create({
      data: { name, description: description || '' },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;