const express = require('express');
const router = express.Router();

router.use('/crops', require('./crops'));
router.use('/rainfall', require('./rainfall'));
router.use('/water-level', require('./water-level'));
router.use('/farmers', require('./farmers'));
router.use('/crop', require('./crop'));

module.exports = router;