const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/admin/farmers:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all farmers (admin)
 *     description: Retrieve a paginated list of all farmer groups with search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of farmer groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Farmer'
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
 *     summary: Create a farmer group
 *     description: Create a new farmer group record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - group
 *               - chairman
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *               group:
 *                 type: string
 *               chairman:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Farmer group created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update a farmer group
 *     description: Update an existing farmer group record
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
 *               - name
 *               - group
 *               - chairman
 *               - members
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               group:
 *                 type: string
 *               chairman:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Farmer group updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a farmer group
 *     description: Delete a farmer group by ID
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
 *         description: Farmer group deleted
 *       400:
 *         description: ID parameter is required
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/farmers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { group: { contains: search } },
        { chairman: { contains: search } },
      ],
    } : {};

    const [farmers, totalCount] = await Promise.all([
      prisma.farmer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          name: true,
          group: true,
          chairman: true,
          members: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.farmer.count({ where }),
    ]);

    // Parse members JSON
    const farmersWithParsedMembers = farmers.map(farmer => {
      try {
        const membersData = farmer.members;
        if (Array.isArray(membersData)) {
          return { ...farmer, members: membersData };
        }
        if (typeof membersData === 'string') {
          const parsed = JSON.parse(membersData);
          return { ...farmer, members: Array.isArray(parsed) ? parsed : [] };
        }
        return { ...farmer, members: [] };
      } catch (parseError) {
        return { ...farmer, members: [] };
      }
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      data: farmersWithParsedMembers,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/admin/farmers
router.post('/', async (req, res) => {
  try {
    const { name, group, chairman, members } = req.body;

    if (!name || !group || !chairman || !members) {
      return res.status(400).json({
        message: 'Name, group, chairman, and members are required',
      });
    }

    // Ensure members is an array
    let membersArray = [];
    if (Array.isArray(members)) {
      membersArray = members;
    } else if (typeof members === 'string') {
      membersArray = members.split(',').map(m => m.trim()).filter(m => m !== '');
    } else {
      return res.status(400).json({
        message: 'Members must be an array or comma-separated string',
      });
    }

    const farmer = await prisma.farmer.create({
      data: {
        name,
        group,
        chairman,
        members: membersArray,
      },
    });

    res.status(201).json(farmer);
  } catch (error) {
    console.error('Error creating farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// PUT /api/admin/farmers
router.put('/', async (req, res) => {
  try {
    const { id, name, group, chairman, members } = req.body;

    if (!id || !name || !group || !chairman || !members) {
      return res.status(400).json({
        message: 'ID, name, group, chairman, and members are required',
      });
    }

    let membersArray = [];
    if (Array.isArray(members)) {
      membersArray = members;
    } else if (typeof members === 'string') {
      membersArray = members.split(',').map(m => m.trim()).filter(m => m !== '');
    } else {
      return res.status(400).json({
        message: 'Members must be an array or comma-separated string',
      });
    }

    const updatedFarmer = await prisma.farmer.update({
      where: { id },
      data: {
        name,
        group,
        chairman,
        members: membersArray,
      },
    });

    res.json(updatedFarmer);
  } catch (error) {
    console.error('Error updating farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// DELETE /api/admin/farmers
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: 'ID parameter is required',
      });
    }

    await prisma.farmer.delete({
      where: { id },
    });

    res.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
