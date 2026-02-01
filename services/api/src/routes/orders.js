const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require('../middleware/auth');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Public route - storefront creates orders without auth
router.post('/', createOrder);

// Protected routes (require API key)
router.get('/', apiKeyAuth, getAllOrders);
router.get('/:id', apiKeyAuth, getOrderById);
router.put('/:id', apiKeyAuth, updateOrder);
router.patch('/:id/status', apiKeyAuth, updateOrderStatus);
router.delete('/:id', apiKeyAuth, deleteOrder);

module.exports = router;
