const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
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
router.post('/', requireAuth, createProductType);
router.put('/:id', requireAuth, updateProductType);
router.delete('/:id', requireAuth, deleteProductType);

module.exports = router;
