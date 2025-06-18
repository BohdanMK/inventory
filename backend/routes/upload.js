const express = require('express');
const { upload } = require('../utils/upload');
const { uploadFile } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;