const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

// GET /api/user-list?role=user&username=ivan
router.get('/user-list', authMiddleware,  profileController.getUsers);


module.exports = router;
