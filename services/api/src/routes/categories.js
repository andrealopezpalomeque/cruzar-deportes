const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (require API key)
router.post('/', apiKeyAuth, createCategory);
router.put('/:id', apiKeyAuth, updateCategory);
router.delete('/:id', apiKeyAuth, deleteCategory);

module.exports = router;
