const express = require('express');
const router = express.Router();
const { createGoodsReceipt, getGoodsReceipt, getGoodsReceiptById } = require('../controllers/goodsReceiptController');

router.get('/', getGoodsReceipt);
router.get('/:id', getGoodsReceiptById);
router.post('/', createGoodsReceipt);


module.exports = router;