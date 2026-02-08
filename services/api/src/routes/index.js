const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const productTypeRoutes = require('./productTypes');
const leagueRoutes = require('./leagues');
const orderRoutes = require('./orders');
const uploadRoutes = require('./upload');
const authRoutes = require('./auth');
const seedRoutes = require('./seed');

// Public
router.use('/health', healthRoutes);

// Resources
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/product-types', productTypeRoutes);
router.use('/leagues', leagueRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/seed', seedRoutes);

module.exports = router;
