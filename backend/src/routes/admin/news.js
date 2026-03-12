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
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/news');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `news_${timestamp}.${fileExtension}`;
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

// GET /api/admin/news
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { title: { contains: search } },
        { slug: { contains: search } },
        { content: { contains: search } },
      ],
    } : {};

    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      news,
      totalPages,
      totalCount,
      currentPage: parseInt(page),
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/news
router.post('/', async (req, res) => {
  try {
    // TODO: Add authentication
    const { title, slug, content, excerpt, image, categoryId, published } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Title, slug, and content are required' });
    }

    // Check if slug already exists
    const existingNews = await prisma.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      return res.status(400).json({ message: 'News with this slug already exists' });
    }

    // For now, set authorId to the first super admin user (or a default)
    // This is a temporary workaround until authentication is implemented
    const superAdmin = await prisma.user.findFirst({
      where: {
        role: {
          name: 'SUPER_ADMIN',
        },
      },
    });

    if (!superAdmin) {
      return res.status(500).json({ message: 'No super admin user found' });
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || '',
        image: image || null,
        categoryId: categoryId || null,
        authorId: superAdmin.id,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/news/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/admin/news/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, image, categoryId, published } = req.body;

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingNews.slug) {
      const slugExists = await prisma.news.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({ message: 'News with this slug already exists' });
      }
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existingNews.title,
        slug: slug ?? existingNews.slug,
        content: content ?? existingNews.content,
        excerpt: excerpt ?? existingNews.excerpt,
        image: image ?? existingNews.image,
        categoryId: categoryId ?? existingNews.categoryId,
        published: published ?? existingNews.published,
        publishedAt: published ? new Date() : existingNews.publishedAt,
      },
    });

    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

// DELETE /api/admin/news/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Delete associated file if it exists
    if (existingNews.image && existingNews.image.startsWith('/uploads/news/')) {
      try {
        const filename = existingNews.image.split('/').pop();
        if (filename) {
          const filePath = path.join(__dirname, '../../../../frontend/public/uploads/news', filename);
          await fsp.unlink(filePath);
          console.log('Deleted file:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    await prisma.news.delete({
      where: { id },
    });

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/news/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Generate public URL (relative to frontend)
    const publicUrl = `/uploads/news/${req.file.filename}`;

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