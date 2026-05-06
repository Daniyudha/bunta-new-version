/**
 * @openapi
 * components:
 *   schemas:
 *     FileStorage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         filename:
 *           type: string
 *         originalName:
 *           type: string
 *         mimeType:
 *           type: string
 *         size:
 *           type: integer
 *         path:
 *           type: string
 *         url:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           nullable: true
 *         uploadedBy:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FileStoragePagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 */

const express = require('express');
const prisma = require('../lib/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for storage file uploads
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../frontend/public/uploads/storage');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * @openapi
 * /api/storage:
 *   get:
 *     tags:
 *       - Storage
 *     summary: Get stored files
 *     description: Retrieve a paginated list of uploaded files with optional category and search filtering
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
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filename, originalName, or description
 *     responses:
 *       200:
 *         description: A paginated list of stored files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileStorage'
 *                 pagination:
 *                   $ref: '#/components/schemas/FileStoragePagination'
 *       500:
 *         description: Internal server error
 */
// GET /api/storage
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [files, total] = await Promise.all([
      prisma.fileStorage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.fileStorage.count({ where })
    ]);

    res.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/storage:
 *   post:
 *     tags:
 *       - Storage
 *     summary: Upload a file (placeholder)
 *     description: File upload endpoint (not yet implemented)
 *     responses:
 *       501:
 *         description: Not implemented
 */
// POST /api/storage - Upload a file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const { category, description } = req.body;
    const file = req.file;

    const url = `/uploads/storage/${file.filename}`;

    // Save to database
    const fileRecord = await prisma.fileStorage.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url,
        category: category || null,
        description: description || null,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'File uploaded successfully',
      file: fileRecord,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum allowed size is 10MB.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/storage/:id - Download a file
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.fileStorage.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Send file as download
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Length', file.size.toString());
    res.sendFile(file.path);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/storage/:id - Delete a file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.fileStorage.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await prisma.fileStorage.delete({
      where: { id }
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
