/**
 * @openapi
 * components:
 *   schemas:
 *     CropData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         area:
 *           type: number
 *           format: float
 *         yield:
 *           type: number
 *           format: float
 *         season:
 *           type: string
 *         location:
 *           type: string
 *         measuredAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/data/crops:
 *   get:
 *     tags:
 *       - Crops
 *     summary: Get crop data
 *     description: Retrieve crop data entries
 *     responses:
 *       200:
 *         description: A list of crop data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CropData'
 *       500:
 *         description: Internal server error
 */
// GET /api/data/crops
router.get('/', async (req, res) => {
  try {
    const cropData = await prisma.cropData.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    res.json(cropData);
  } catch (error) {
    console.error('Error fetching crop data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

module.exports = router;
