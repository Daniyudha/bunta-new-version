/**
 * @openapi
 * components:
 *   schemas:
 *     IrrigationProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         latitude:
 *           type: number
 *           format: float
 *           nullable: true
 *         longitude:
 *           type: number
 *           format: float
 *           nullable: true
 *         area:
 *           type: number
 *         waterLevel:
 *           type: number
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [normal, low, high, critical]
 *         canals:
 *           type: integer
 *           nullable: true
 *         gates:
 *           type: integer
 *           nullable: true
 *         waterSource:
 *           type: string
 *           nullable: true
 *         lastUpdate:
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
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * @openapi
 * /api/irrigation-profiles:
 *   get:
 *     tags:
 *       - Irrigation Profiles
 *     summary: Get all irrigation profiles
 *     description: Retrieve a paginated list of irrigation profiles with optional search and filtering
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
 *           default: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, description, location, or water source
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [normal, low, high, critical]
 *         description: Filter by status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: A paginated list of irrigation profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IrrigationProfile'
 *                 totalPages:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
// GET /api/irrigation-profiles - public endpoint
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      search = '', 
      status = '',
      location = '' 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { waterSource: { contains: search } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (location) {
      where.location = { contains: location };
    }

    const [profiles, totalCount] = await Promise.all([
      prisma.irrigationProfile.findMany({
        where,
        orderBy: [
          { createdAt: 'desc' },
        ],
        skip,
        take,
      }),
      prisma.irrigationProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      profiles,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    console.error('Error fetching irrigation profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/irrigation-profiles/{id}:
 *   get:
 *     tags:
 *       - Irrigation Profiles
 *     summary: Get irrigation profile by ID
 *     description: Retrieve a single irrigation profile by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Irrigation profile ID
 *     responses:
 *       200:
 *         description: Irrigation profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IrrigationProfile'
 *       404:
 *         description: Irrigation profile not found
 *       500:
 *         description: Internal server error
 */
// GET /api/irrigation-profiles/:id - public endpoint
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.irrigationProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Irrigation profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;