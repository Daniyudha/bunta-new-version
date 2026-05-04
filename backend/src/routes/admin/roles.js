const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

/**
 * @openapi
 * /api/admin/roles:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all roles
 *     description: Retrieve a list of all roles with their permissions and user counts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of roles
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
 *                   description:
 *                     type: string
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         permission:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             category:
 *                               type: string
 *                   users:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create role (placeholder)
 *     description: Create a new role (not yet implemented)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: Not implemented
 */
// GET /api/admin/roles
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/roles (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

/**
 * @openapi
 * /api/admin/roles/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a role by ID
 *     description: Retrieve a single role with its permissions
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
 *         description: Role data
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update a role
 *     description: Update role name, description, and permissions
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
 *               description:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a role
 *     description: Delete a role by ID
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
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */

// GET /api/admin/roles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: true,
      },
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/roles/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isDefault, permissionIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent editing of SUPER_ADMIN role name
    if (existingRole.name === 'SUPER_ADMIN' && name !== 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Cannot change SUPER_ADMIN role name' });
    }

    // Check if name is already taken by another role
    const roleWithSameName = await prisma.role.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (roleWithSameName) {
      return res.status(409).json({ error: 'Role name already exists' });
    }

    // Update role with permissions
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        isDefault: isDefault || false,
        permissions: {
          deleteMany: {}, // Remove all existing permissions
          create: permissionIds?.map((permissionId) => ({
            permissionId,
          })) || [],
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    res.json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/roles/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent deletion of SUPER_ADMIN role
    if (existingRole.name === 'SUPER_ADMIN') {
      return res.status(400).json({ error: 'Cannot delete SUPER_ADMIN role' });
    }

    // Check if role is assigned to any users
    const usersWithRole = await prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return res.status(409).json({ error: 'Cannot delete role that is assigned to users' });
    }

    // Delete role permissions first (due to foreign key constraints)
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Delete the role
    await prisma.role.delete({
      where: { id },
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
