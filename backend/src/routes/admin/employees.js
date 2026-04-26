const express = require('express');
const prisma = require('../../lib/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/employees');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `employee_${timestamp}.${fileExtension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @openapi
 * /api/admin/employees:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all employees (admin)
 *     description: Retrieve a paginated list of all employees with search
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
 *         description: A paginated list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create an employee
 *     description: Create a new employee record
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
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               education:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: PNS
 *               photo:
 *                 type: string
 *               department:
 *                 type: string
 *               age:
 *                 type: integer
 *               workRegion:
 *                 type: string
 *               order:
 *                 type: integer
 *               pangkat_golongan:
 *                 type: string
 *               nip:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
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
        { pangkat_golongan: { contains: search } },
        { nip: { contains: search } },
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

/**
 * @openapi
 * /api/admin/employees/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get employee by ID (admin)
 *     description: Retrieve a single employee by ID
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
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an employee
 *     description: Update an existing employee record
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
 *             required:
 *               - name
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               education:
 *                 type: string
 *               status:
 *                 type: string
 *               photo:
 *                 type: string
 *               department:
 *                 type: string
 *               age:
 *                 type: integer
 *               workRegion:
 *                 type: string
 *               order:
 *                 type: integer
 *               pangkat_golongan:
 *                 type: string
 *               nip:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete an employee
 *     description: Delete an employee record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
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
    const { name, position, education, status, photo, department, age, workRegion, order, pangkat_golongan, nip, whatsapp, location } = req.body;

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
        pangkat_golongan: pangkat_golongan || null,
        nip: nip || null,
        order: order ? parseInt(order) : 0,
        whatsapp: whatsapp || null,
        location: location || null,
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
    const { name, position, education, status, photo, department, age, workRegion, order, pangkat_golongan, nip, whatsapp, location } = req.body;

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
        pangkat_golongan: pangkat_golongan !== undefined ? pangkat_golongan : existingEmployee.pangkat_golongan,
        nip: nip !== undefined ? nip : existingEmployee.nip,
        order: order !== undefined ? parseInt(order) : existingEmployee.order,
        whatsapp: whatsapp !== undefined ? whatsapp : existingEmployee.whatsapp,
        location: location !== undefined ? location : existingEmployee.location,
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

// POST /api/admin/employees/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Generate public URL (relative to frontend)
    const publicUrl = `/uploads/employees/${req.file.filename}`;

    res.status(201).json({
      url: publicUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
