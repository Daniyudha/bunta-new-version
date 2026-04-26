const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/admin/data/rainfall:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get rainfall data (admin)
 *     description: Retrieve a paginated list of rainfall data entries with location filtering
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
 *         description: A paginated list of rainfall data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RainfallData'
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
 *     summary: Create rainfall data entry
 *     description: Create a new rainfall data record
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
 *                 default: mm
 *               measuredAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Rainfall data created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update rainfall data entry
 *     description: Update an existing rainfall data record
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
 *                 default: mm
 *               measuredAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Rainfall data updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete rainfall data entry
 *     description: Delete a rainfall data record by ID
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
// GET /api/admin/data/rainfall
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = location ? { location: { contains: location } } : {};

    const [rainfallData, totalCount] = await Promise.all([
      prisma.rainfallData.findMany({
        where,
        orderBy: { measuredAt: 'desc' },
        skip,
        take,
      }),
      prisma.rainfallData.count({ where }),
    ]);

    res.json({
      data: rainfallData,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/rainfall
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

    const rainfallData = await prisma.rainfallData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
        recordedBy,
      },
    });

    res.status(201).json(rainfallData);
  } catch (error) {
    console.error('Error creating rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/rainfall
router.put('/', async (req, res) => {
  try {
    const { id, location, value, unit, measuredAt } = req.body;

    if (!id || !location || value === undefined || !measuredAt) {
      return res.status(400).json({
        message: 'ID, location, value, and measuredAt are required',
      });
    }

    const updatedData = await prisma.rainfallData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/rainfall
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.rainfallData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting rainfall data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
