const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');
const { upload } = require('../utils/upload');

// 🔐 GET /api/profile - список користувачів (з авторизацією)
router.get('/', authMiddleware, profileController.getUsers);

// 🔐 GET /api/profile/user - поточний користувач
router.get('/user', authMiddleware, profileController.getCurrentUser);

// 🔐 PUT /api/profile/user - оновлення користувача
router.put('/user', authMiddleware, profileController.updateCurrentUser);

// 🔐 PUT /api/profile/avatar - оновлення аватарки
router.put('/avatar', authMiddleware, upload.single('file'), profileController.updateAvatar);

// 🔐 PUT /api/profile/new-password - оновлення пароля
router.put('/new-password', authMiddleware, profileController.updatePassword);

// 🔐 DELETE /api/profile/:id - видалення користувача
router.delete('/:id', authMiddleware, profileController.deleteUser);

module.exports = router;
