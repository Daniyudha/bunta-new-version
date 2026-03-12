const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// CORS headers (already handled by global middleware, but we keep for compatibility)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS handler
router.options('/', (req, res) => {
  res.set(corsHeaders).status(200).json({});
});

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    console.log('Contact form submission received');
    console.log('Request headers:', req.headers);

    const body = req.body;
    console.log('Request body:', body);

    // Validate required fields (phone is optional)
    if (!body.name || !body.email || !body.subject || !body.message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({
        error: 'Database connection failed. Please check database configuration.'
      });
    }

    // Save to database (phone is optional)
    console.log('Attempting to save contact submission to database...');
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        phone: body.phone || null,
        status: 'unread'
      }
    });
    console.log('Database save successful:', submission);

    console.log('Contact form submission saved:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      timestamp: submission.createdAt
    });

    res.set(corsHeaders).status(200).json({
      message: 'Contact form submitted successfully',
      submissionId: submission.id
    });
  } catch (error) {
    console.error('Error processing contact form:', error);

    // Handle Prisma errors specifically
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);

      const errorMessage = process.env.NODE_ENV === 'development'
        ? `Database error: ${error.message}`
        : 'Database error. Please check if the ContactSubmission table exists and migrations are applied.';

      if (error.message.includes('prisma') || error.message.includes('database')) {
        return res.set(corsHeaders).status(500).json({ error: errorMessage });
      }
    }

    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
      : 'Internal server error. Please try again later.';

    res.set(corsHeaders).status(500).json({ error: errorMessage });
  }
});

// GET method not allowed
router.get('/', (req, res) => {
  res.set(corsHeaders).status(405).json({ error: 'Method not allowed' });
});

module.exports = router;