/**
 * @openapi
 * components:
 *   schemas:
 *     Slider:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *           nullable: true
 *         subtitle:
 *           type: string
 *           nullable: true
 *         image:
 *           type: string
 *         link:
 *           type: string
 *           nullable: true
 *         order:
 *           type: integer
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
 * /api/sliders:
 *   get:
 *     tags:
 *       - Sliders
 *     summary: Get active sliders
 *     description: Retrieve all active slider/carousel items ordered by sort order
 *     responses:
 *       200:
 *         description: A list of active sliders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slider'
 *       500:
 *         description: Internal server error
 */
// GET /api/sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
