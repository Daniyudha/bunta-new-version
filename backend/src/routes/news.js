/**
 * @openapi
 * components:
 *   schemas:
 *     NewsCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *     NewsArticle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         excerpt:
 *           type: string
 *         content:
 *           type: string
 *         image:
 *           type: string
 *         published:
 *           type: boolean
 *         category:
 *           $ref: '#/components/schemas/NewsCategory'
 *         author:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NewsPagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 *         hasNext:
 *           type: boolean
 *         hasPrev:
 *           type: boolean
 */

const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

/**
 * @openapi
 * /api/news:
 *   get:
 *     tags:
 *       - News
 *     summary: Get published news articles
 *     description: Retrieve a paginated list of published news articles with optional category and search filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, excerpt, or content
 *     responses:
 *       200:
 *         description: A paginated list of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 news:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NewsArticle'
 *                 pagination:
 *                   $ref: '#/components/schemas/NewsPagination'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/news/{slug}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get a news article by slug
 *     description: Retrieve a single published news article by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: News article slug
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsArticle'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
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
