const express = require('express');
const router = express.Router();
const dashBoardController = require('../controllers/dashBoardInfo');

router.get('/productsInfo', dashBoardController.getTotalProducts);
router.get('/stockActionsSummary', dashBoardController.getStockActionsSummary);

module.exports = router;
