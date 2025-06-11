// routes/index.js
const express = require('express');

const avatarRoutes = require('./avatar');
const authSA = require('./authSA');
const authUser = require('./authUser');
const profileRoutes = require('./profile');
const usersRoutes = require('./users');
const userRoutes = require('./user');
const userUpload = require('./upload');
const categoryRoutes = require('./categories');
const statusRoutes = require('./statuses');
const productTemplateRoutes = require('./productTemplate');
const warehouseRoutes = require('./warehouse');
const goodsReceiptRoutes = require('./goodsReceipt');
const productInStockRoutes = require('./productInStockRoutes');
const stockRoutes = require('./stockRoutes')

const router = express.Router();

// Підключаємо всі підроути
router.use('/avatar', avatarRoutes);
router.use('/registerSA', authSA);
router.use('/registerUser', authUser);
router.use('/authSA', authSA);
router.use('/authUser', authUser);
router.use('/profile', profileRoutes);
router.use('/users', usersRoutes);
router.use('/user', userRoutes);
router.use('/upload', userUpload);
router.use('/categories', categoryRoutes);
router.use('/statuses', statusRoutes);
router.use('/productTemplate', productTemplateRoutes);
router.use('/warehouse', warehouseRoutes);
router.use('/goods-receipts', goodsReceiptRoutes);
router.use('/products-in-stock', productInStockRoutes);
router.use('/stock-actions', stockRoutes);

module.exports = router;
