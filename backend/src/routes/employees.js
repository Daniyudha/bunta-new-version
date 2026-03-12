const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/employees - public endpoint
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '' } = req.query;
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

// GET /api/employees/:id - public endpoint
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

module.exports = router;