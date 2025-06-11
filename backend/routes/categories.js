const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);

router.post('/add', categoryController.addCategory);

router.put('/edit/:id', categoryController.editCategory);

router.post('/delete/:id', categoryController.deleteCategory);

module.exports = router;
