const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { seedProductTypesAndLeagues } = require('../controllers/seedController');

// Protected routes (require API key)
router.post('/product-types-and-leagues', requireAuth, seedProductTypesAndLeagues);

module.exports = router;
