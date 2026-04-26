/**
 * @openapi
 * components:
 *   schemas:
 *     RainfallData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         location:
 *           type: string
 *         value:
 *           type: number
 *           format: float
 *         unit:
 *           type: string
 *           default: mm
 *         measuredAt:
 *           type: string
 *           format: date-time
 *         recordedBy:
 *           type: string
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
 * /api/data/rainfall:
 *   get:
 *     tags:
 *       - Rainfall
 *     summary: Get rainfall data
 *     description: Retrieve rainfall measurements with optional location filtering
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location name
 *     responses:
 *       200:
 *         description: A list of rainfall data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RainfallData'
 *       500:
 *         description: Internal server error
 */
// GET /api/data/rainfall
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const where = location ? { location: { contains: location } } : {};

    const rainfallData = await prisma.rainfallData.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    res.json(rainfallData);
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

/**
 * @openapi
 * /api/data/rainfall/count:
 *   get:
 *     tags:
 *       - Rainfall
 *     summary: Get rainfall data count
 *     description: Retrieve the total count of rainfall records
 *     responses:
 *       200:
 *         description: Record count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
// GET /api/data/rainfall/count
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.rainfallData.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching rainfall data count:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;
