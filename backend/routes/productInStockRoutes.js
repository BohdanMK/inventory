const express = require('express');
const router = express.Router();
const { getAllProductsInStock, replaceProductInStock } = require('../controllers/productInStockController');

// GET /api/products-in-stock
router.get('/', getAllProductsInStock);

// Передаємо productId в URL
router.post('/replace/:productId', replaceProductInStock);


module.exports = router;