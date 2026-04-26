/**
 * @openapi
 * components:
 *   schemas:
 *     FileStorage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         filename:
 *           type: string
 *         originalName:
 *           type: string
 *         mimeType:
 *           type: string
 *         size:
 *           type: integer
 *         path:
 *           type: string
 *         url:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           nullable: true
 *         uploadedBy:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FileStoragePagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 */

const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * @openapi
 * /api/storage:
 *   get:
 *     tags:
 *       - Storage
 *     summary: Get stored files
 *     description: Retrieve a paginated list of uploaded files with optional category and search filtering
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
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filename, originalName, or description
 *     responses:
 *       200:
 *         description: A paginated list of stored files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileStorage'
 *                 pagination:
 *                   $ref: '#/components/schemas/FileStoragePagination'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /api/storage:
 *   post:
 *     tags:
 *       - Storage
 *     summary: Upload a file (placeholder)
 *     description: File upload endpoint (not yet implemented)
 *     responses:
 *       501:
 *         description: Not implemented
 */
// POST /api/storage (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'File upload not implemented yet' });
});

module.exports = router;
