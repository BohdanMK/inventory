const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'super_admin' });
    if (!user) {
      return res.status(400).json({ message: 'User not found or not a super admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '3h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const registerSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSuperAdmin = new User({
      email,
      password: hashedPassword,
      role: 'super_admin',
    });

    await newSuperAdmin.save();
    res.status(201).json({ message: 'Super Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSuperAdmin = async (req, res) => {
  try {
    const { email, password, username, role, avatar } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.status(200).json({ message: 'Super Admin updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginSuperAdmin,
  registerSuperAdmin,
  updateSuperAdmin,
};
