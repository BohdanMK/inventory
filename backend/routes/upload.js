const express = require('express');
const multer = require('multer');
const path = require('path');
const iconv = require('iconv-lite');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Налаштування Multer для завантаження файлів
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Папка для збереження
  },
  filename: function (req, file, cb) {
    const decodedName = iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8');
    cb(null, Date.now() + '-' + decodedName);
  }
});
const upload = multer({ storage: storage });

// Роут для завантаження файлу
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    fileName: req.file.filename,
    filePath: `uploads/${req.file.filename}`
  });
});

module.exports = router;
