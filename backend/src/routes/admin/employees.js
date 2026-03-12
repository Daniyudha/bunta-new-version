const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/employees
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { position: { contains: search } },
        { department: { contains: search } },
        { education: { contains: search } },
      ],
    } : {};

    const [employees, totalCount] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take,
      }),
      prisma.employee.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      employees,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/employees
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication
    const { name, position, education, status, photo, department, age, workRegion, order } = req.body;

    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({ message: 'Name and position are required' });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        position,
        education: education || null,
        status: status || 'PNS',
        photo: photo || null,
        department: department || null,
        age: age ? parseInt(age) : null,
        workRegion: workRegion || null,
        order: order ? parseInt(order) : 0,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, education, status, photo, department, age, workRegion, order } = req.body;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({ message: 'Name and position are required' });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        position,
        education: education || null,
        status: status || existingEmployee.status,
        photo: photo !== undefined ? photo : existingEmployee.photo,
        department: department !== undefined ? department : existingEmployee.department,
        age: age !== undefined ? (age ? parseInt(age) : null) : existingEmployee.age,
        workRegion: workRegion !== undefined ? workRegion : existingEmployee.workRegion,
        order: order !== undefined ? parseInt(order) : existingEmployee.order,
      },
    });

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await prisma.employee.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;