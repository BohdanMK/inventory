// services/authService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUserService = async ({ email, password, isSuperAdmin }) => {
  const userRole = isSuperAdmin ? 'super_admin' : 'user';
  const user = await User.findOne({ email, role: userRole });

  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '3h' }
  );

  return token;
};

const registerUserService = async ({ email, password, username, isSuperAdmin }) => {
  const userRole = isSuperAdmin ? 'super_admin' : 'user';
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: userRole,
  });

  await newUser.save();
};

module.exports = {
  loginUserService,
  registerUserService,
};
