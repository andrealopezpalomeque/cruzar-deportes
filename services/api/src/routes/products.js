const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (require API key)
router.post('/', apiKeyAuth, createProduct);
router.put('/:id', apiKeyAuth, updateProduct);
router.delete('/:id', apiKeyAuth, deleteProduct);

module.exports = router;
