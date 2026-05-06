const express = require('express');
const prisma = require('../../lib/prisma');

const router = express.Router();

/**
 * @openapi
 * /api/admin/contact-submissions:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all contact submissions
 *     description: Retrieve a list of all contact form submissions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of contact submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactSubmission'
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create contact submission (placeholder)
 *     description: Admin creation of contact submissions (not yet implemented)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: Not implemented
 */
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

// PATCH /api/admin/contact-submissions/:id - Update submission status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['unread', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const existing = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
