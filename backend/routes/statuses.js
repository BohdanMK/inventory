const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// GET /api/statuses
router.get('/', statusController.getStatuses);

// POST /api/statuses/add
router.post('/add', statusController.createStatus);

// PUT /api/statuses/edit/:id
router.put('/edit/:id', statusController.updateStatus);

// POST /api/statuses/delete/:id
router.post('/delete/:id', statusController.deleteStatus);

module.exports = router;