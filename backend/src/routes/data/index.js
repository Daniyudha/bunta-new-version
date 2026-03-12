const express = require('express');
const router = express.Router();

router.use('/crops', require('./crops'));
router.use('/rainfall', require('./rainfall'));
router.use('/water-level', require('./water-level'));
router.use('/farmers', require('./farmers'));
router.use('/crop', require('./crop'));
router.use('/validate-all', require('./validate-all'));
// TODO: add other data routes (farmers, etc.)

module.exports = router;