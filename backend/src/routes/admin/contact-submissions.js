const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

// GET /api/admin/contact-submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/contact-submissions (placeholder)
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;