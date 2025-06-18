const multer = require('multer');
const path = require('path');
const iconv = require('iconv-lite');

// Налаштування з декодуванням імені файлу
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const decodedName = iconv.decode(Buffer.from(file.originalname, 'latin1'), 'utf8');
    cb(null, Date.now() + '-' + decodedName);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, });

module.exports = { upload };