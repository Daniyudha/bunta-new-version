const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Retrieve a list of all users with their roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   roleId:
 *                     type: string
 *                   role:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   _count:
 *                     type: object
 *                     properties:
 *                       news:
 *                         type: integer
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create user (placeholder)
 *     description: Create a new user (not yet implemented)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: Not implemented
 */
// GET /api/admin/users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            news: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/users (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
