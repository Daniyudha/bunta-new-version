const express = require('express');
const prisma = require('../../lib/prisma');
const bcrypt = require('bcryptjs');

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

// POST /api/admin/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
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
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a user by ID
 *     description: Retrieve a single user with their role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a user
 *     description: Update user name, email, password, or role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user
 *     description: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

// GET /api/admin/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/admin/users/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleId } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modification of Super Admin account's email and role
    if (existingUser.email === 'su.admin@irigasibunta.com') {
      if (email && email !== existingUser.email) {
        return res.status(400).json({ message: 'Cannot change Super Admin account email' });
      }
      if (roleId && roleId !== existingUser.roleId) {
        return res.status(400).json({ message: 'Cannot change Super Admin account role' });
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
        password: hashedPassword ?? existingUser.password,
        roleId: roleId ?? existingUser.roleId,
      },
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
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of Super Admin account
    if (existingUser.email === 'su.admin@irigasibunta.com') {
      return res.status(400).json({ message: 'Cannot delete Super Admin account' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
