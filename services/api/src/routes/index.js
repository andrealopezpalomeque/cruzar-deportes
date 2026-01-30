const express = require('express');
const router = express.Router();

const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const uploadRoutes = require('./upload');
const authRoutes = require('./auth');

// Mount routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);

module.exports = router;
