const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/admin/data/water-level:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get water level data (admin)
 *     description: Retrieve a paginated list of water level data entries with location filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: A paginated list of water level data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WaterLevelData'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create water level data entry
 *     description: Create a new water level data record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - value
 *               - measuredAt
 *             properties:
 *               location:
 *                 type: string
 *               value:
 *                 type: number
 *                 format: float
 *               unit:
 *                 type: string
 *                 default: cm
 *               measuredAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Water level data created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update water level data entry
 *     description: Update an existing water level data record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - location
 *               - value
 *               - measuredAt
 *             properties:
 *               id:
 *                 type: string
 *               location:
 *                 type: string
 *               value:
 *                 type: number
 *                 format: float
 *               unit:
 *                 type: string
 *                 default: cm
 *               measuredAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Water level data updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete water level data entry
 *     description: Delete a water level data record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *       400:
 *         description: ID parameter is required
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/data/water-level
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = location ? { location: { contains: location } } : {};

    const [waterLevelData, totalCount] = await Promise.all([
      prisma.waterLevelData.findMany({
        where,
        orderBy: { measuredAt: 'desc' },
        skip,
        take,
      }),
      prisma.waterLevelData.count({ where }),
    ]);

    res.json({
      data: waterLevelData,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error('Error fetching water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/water-level
router.post('/', async (req, res) => {
  try {
    const { location, value, unit, measuredAt } = req.body;

    if (!location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'Location, value, and measuredAt are required',
      });
    }

    // TODO: get user ID from session
    const recordedBy = 'admin';

    const waterLevelData = await prisma.waterLevelData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
        recordedBy,
      },
    });

    res.status(201).json(waterLevelData);
  } catch (error) {
    console.error('Error creating water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/water-level
router.put('/', async (req, res) => {
  try {
    const { id, location, value, unit, measuredAt } = req.body;

    if (!id || !location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'ID, location, value, and measuredAt are required',
      });
    }

    const updatedData = await prisma.waterLevelData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/water-level
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.waterLevelData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting water level data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
