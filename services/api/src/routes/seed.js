const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const { seedCategories, migrateProducts } = require('../controllers/seedController');

// Protected routes (require API key)
router.post('/categories', apiKeyAuth, seedCategories);
router.post('/migrate-products', apiKeyAuth, migrateProducts);

module.exports = router;
