const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      published: true,
    };

    if (category && category !== 'All') {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          excerpt: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// GET /api/news/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.news.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!article || !article.published) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Transform to frontend-friendly format
    const transformed = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category,
      createdAt: article.createdAt,
      published: article.published,
      author: article.author?.name || 'Admin',
      tags: [],
    };

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Error fetching article' });
  }
});

module.exports = router;