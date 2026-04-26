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

module.exports = router;
