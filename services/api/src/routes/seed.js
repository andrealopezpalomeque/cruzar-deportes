const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { seedCategories } = require('../controllers/seedController');

// Protected routes (require API key)
router.post('/categories', apiKeyAuth, seedCategories);

module.exports = router;
