const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.delete('/delete-user/:id', userController.deleteUser);

router.put('/update-user/:id', userController.updateUser);

router.put('/new-password/:id', userController.updatePassword);

module.exports = router;