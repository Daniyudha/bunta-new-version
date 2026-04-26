const express = require('express');
const prisma = require('../../lib/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `gallery_${timestamp}.${fileExtension}`;
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
 * /api/admin/gallery:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all gallery items (admin)
 *     description: Retrieve a paginated list of all gallery items (including inactive) with search and category filtering
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryImage'
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
 *     summary: Create a gallery item
 *     description: Create a new gallery image entry
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
 *               - imageUrl
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 default: image
 *               active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Gallery item created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/gallery
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause for search and category
    let where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      // If we already have where conditions (from search), use AND to combine
      if (Object.keys(where).length > 0) {
        where = {
          AND: [
            where,
            { category }
          ]
        };
      } else {
        where.category = category;
      }
    }

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gallery.count({ where }),
    ]);

    res.json({
      data: gallery,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/gallery
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication
    const { title, description, imageUrl, category, type, active } = req.body;

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return res.status(400).json({ message: 'Title, imageUrl, and category are required' });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        category,
        type: type || 'image',
        active: active ?? true,
      },
    });

    res.status(201).json(gallery);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/gallery/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Generate public URL (relative to frontend)
    const publicUrl = `/uploads/gallery/${req.file.filename}`;

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

// GET /api/admin/gallery/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/admin/gallery/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, category, type, active } = req.body;

    // Check if gallery item exists
    const existing = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        category: category !== undefined ? category : existing.category,
        type: type !== undefined ? type : existing.type,
        active: active !== undefined ? active : existing.active,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/gallery/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if gallery item exists
    const existing = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await prisma.gallery.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
