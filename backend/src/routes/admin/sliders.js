const express = require('express');
const prisma = require('../../lib/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/sliders');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `slider_${timestamp}.${fileExtension}`;
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
 * /api/admin/sliders:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all sliders (admin)
 *     description: Retrieve all slider items including inactive ones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all slider items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slider'
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a slider
 *     description: Create a new slider/carousel item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               image:
 *                 type: string
 *               link:
 *                 type: string
 *               buttonText:
 *                 type: string
 *               order:
 *                 type: integer
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Slider created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/sliders
router.get('/', async (req, res) => {
  try {
    const sliders = await prisma.slider.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/sliders
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, link, buttonText, order, active } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/sliders/${req.file.filename}`;
    }

    if (!imagePath) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const slider = await prisma.slider.create({
      data: {
        title,
        subtitle: subtitle || null,
        image: imagePath,
        link: link || null,
        buttonText: buttonText || 'Pelajari Lebih Lanjut',
        order: order !== undefined ? parseInt(order) : 0,
        active: active !== undefined ? active === 'true' || active === true : true,
      },
    });

    res.status(201).json(slider);
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/sliders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await prisma.slider.findUnique({ where: { id } });
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    res.json(slider);
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/sliders/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, link, buttonText, order, active } = req.body;

    const existing = await prisma.slider.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    let imagePath = existing.image;
    if (req.file) {
      imagePath = `/uploads/sliders/${req.file.filename}`;
    }

    const updated = await prisma.slider.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        subtitle: subtitle !== undefined ? subtitle : existing.subtitle,
        image: imagePath,
        link: link !== undefined ? link : existing.link,
        buttonText: buttonText !== undefined ? buttonText : existing.buttonText,
        order: order !== undefined ? parseInt(order) : existing.order,
        active: active !== undefined ? (active === 'true' || active === true) : existing.active,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/sliders/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.slider.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    await prisma.slider.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
