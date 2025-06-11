const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockActionsController');

router.get('/', stockController.getAllStockActions);
router.get('/:id', stockController.getStockActionById);
router.get('/:productId', stockController.getStockActionById);
router.post('/shipment', (req, res) => stockController.createStockAction(req, res, 'SHIPMENT'));
router.post('/writeoff', (req, res) => stockController.createStockAction(req, res, 'WRITEOFF'));
router.post('/return', (req, res) => stockController.createStockAction(req, res, 'RETURN'));
router.post('/cancel', (req, res) => stockController.createStockAction(req, res, 'CANCEL'));

module.exports = router;