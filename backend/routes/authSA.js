const express = require('express');
const {
  loginSuperAdmin,
  registerSuperAdmin,
  updateSuperAdmin,
} = require('../controllers/authSAController');

const router = express.Router();

router.post('/login-super-admin', loginSuperAdmin);
router.post('/register-super-admin', registerSuperAdmin);
router.put('/update-super-admin/:id', updateSuperAdmin);

module.exports = router;
