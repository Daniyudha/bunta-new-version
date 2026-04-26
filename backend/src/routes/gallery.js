/**
 * @openapi
 * components:
 *   schemas:
 *     GalleryImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *         category:
 *           type: string
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

/**
 * @openapi
 * /api/gallery:
 *   get:
 *     tags:
 *       - Gallery
 *     summary: Get gallery images
 *     description: Retrieve active gallery images with optional category filtering
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *     responses:
 *       200:
 *         description: A list of gallery images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GalleryImage'
 *       500:
 *         description: Internal server error
 */
// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;

    // Build where clause for filtering
    const where = { active: true };

    if (category && category !== 'All') {
      where.category = category;
    }

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
