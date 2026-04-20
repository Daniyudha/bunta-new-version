const express = require('express');
const router = express.Router();

router.use('/water-level', require('./water-level'));
router.use('/rainfall', require('./rainfall'));
router.use('/crops', require('./crops'));

module.exports = router;