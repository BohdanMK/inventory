// controllers/authUserController.js

const {
  loginUserService,
  registerUserService,
} = require('../services/authService');

const loginUser = async (req, res) => {
  try {
    const token = await loginUserService(req.body);
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    const message =
      error.message === 'User not found' || error.message === 'Invalid password'
        ? error.message
        : 'Server error';
    res.status(400).json({ message });
  }
};

const registerUser = async (req, res) => {
  try {
    await registerUserService(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    const message =
      error.message === 'User already exists' ? error.message : 'Server error';
    res.status(400).json({ message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
