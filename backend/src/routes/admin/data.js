const express = require('express');
const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AdminWaterLevelData:
 *       allOf:
 *         - $ref: '#/components/schemas/WaterLevelData'
 *         - type: object
 *           properties:
 *             recordedBy:
 *               type: string
 */

router.use('/water-level', require('./water-level'));
router.use('/rainfall', require('./rainfall'));
router.use('/crops', require('./crops'));

module.exports = router;
