const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/gallery
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause for search and category
    let where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      // If we already have where conditions (from search), use AND to combine
      if (Object.keys(where).length > 0) {
        where = {
          AND: [
            where,
            { category }
          ]
        };
      } else {
        where.category = category;
      }
    }

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gallery.count({ where }),
    ]);

    res.json({
      data: gallery,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/gallery
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication
    const { title, description, imageUrl, category, type, active } = req.body;

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return res.status(400).json({ message: 'Title, imageUrl, and category are required' });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        category,
        type: type || 'image',
        active: active ?? true,
      },
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;