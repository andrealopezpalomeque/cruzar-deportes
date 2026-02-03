const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType
} = require('../controllers/productTypeController');

// Public routes
router.get('/', getAllProductTypes);
router.get('/:id', getProductTypeById);

// Protected routes (require API key)
router.post('/', apiKeyAuth, createProductType);
router.put('/:id', apiKeyAuth, updateProductType);
router.delete('/:id', apiKeyAuth, deleteProductType);

module.exports = router;
