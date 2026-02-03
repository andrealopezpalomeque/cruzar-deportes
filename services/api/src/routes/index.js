const express = require('express');
const router = express.Router();

const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const productTypeRoutes = require('./productTypes');
const leagueRoutes = require('./leagues');
const seedRoutes = require('./seed');
const uploadRoutes = require('./upload');
const authRoutes = require('./auth');
const orderRoutes = require('./orders');

// Mount routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/product-types', productTypeRoutes);
router.use('/leagues', leagueRoutes);
router.use('/seed', seedRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
