const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
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
router.get('/', requireAuth, getAllOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id', requireAuth, updateOrder);
router.patch('/:id/status', requireAuth, updateOrderStatus);
router.delete('/:id', requireAuth, deleteOrder);

module.exports = router;
