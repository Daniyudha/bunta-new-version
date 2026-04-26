const express = require('express');
const router = express.Router();
const prisma = require('../../lib/prisma');

/**
 * @openapi
 * /api/data/crop/count:
 *   get:
 *     tags:
 *       - Crops
 *     summary: Get crop data count
 *     description: Retrieve the total count of crop records
 *     responses:
 *       200:
 *         description: Record count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
// GET /api/data/crop/count
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.cropData.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching crop data count:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;
