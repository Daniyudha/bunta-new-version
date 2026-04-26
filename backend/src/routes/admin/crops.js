const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/admin/data/crops:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get crop data (admin)
 *     description: Retrieve a paginated list of crop data entries with search and location filtering
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of crop data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CropData'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create crop data entry
 *     description: Create a new crop data record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - crop
 *               - area
 *               - production
 *               - season
 *             properties:
 *               crop:
 *                 type: string
 *               area:
 *                 type: number
 *                 format: float
 *               production:
 *                 type: number
 *                 format: float
 *               season:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Crop data created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update crop data entry
 *     description: Update an existing crop data record
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
 *               - crop
 *               - area
 *               - production
 *               - season
 *             properties:
 *               id:
 *                 type: string
 *               crop:
 *                 type: string
 *               area:
 *                 type: number
 *                 format: float
 *               production:
 *                 type: number
 *                 format: float
 *               season:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop data updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete crop data entry
 *     description: Delete a crop data record by ID
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
// GET /api/admin/data/crops
router.get('/', async (req, res) => {
  try {
    const { location, page = 1, limit = 100, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (location) {
      where.location = { contains: location };
    }
    if (search) {
      where.OR = [
        { crop: { contains: search } },
        { season: { contains: search } },
      ];
    }

    const [cropData, totalCount] = await Promise.all([
      prisma.cropData.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.cropData.count({ where }),
    ]);

    res.json({
      data: cropData,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/data/crops
router.post('/', async (req, res) => {
  try {
    const { crop, area, production, season, location } = req.body;

    if (!crop || area === undefined || production === undefined || !season) {
      return res.status(400).json({
        message: 'Crop, area, production, and season are required',
      });
    }

    // TODO: get user ID from session
    const recordedBy = 'admin';

    const cropData = await prisma.cropData.create({
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
        recordedBy,
      },
    });

    res.status(201).json(cropData);
  } catch (error) {
    console.error('Error creating crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/data/crops
router.put('/', async (req, res) => {
  try {
    const { id, crop, area, production, season, location } = req.body;

    if (!id || !crop || area === undefined || production === undefined || !season) {
      return res.status(400).json({
        message: 'ID, crop, area, production, and season are required',
      });
    }

    const updatedData = await prisma.cropData.update({
      where: { id },
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error('Error updating crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/data/crops
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.cropData.delete({
      where: { id },
    });

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop data:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
