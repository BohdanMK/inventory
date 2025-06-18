const User = require('../models/User');
const bcrypt = require('bcrypt');

async function deleteUserService(id) {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error('User not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return true;
}

async function updateUserService(id, { email, username, role }) {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { email, username, role },
    { new: true }
  );

  if (!updatedUser) {
    const err = new Error('User not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return updatedUser;
}

async function updatePasswordService(id, password) {
  if (!password || password.length < 3) {
    const err = new Error('Invalid password');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: { password: hashedPassword } },
    { new: true }
  ).select('-password');

  if (!updatedUser) {
    const err = new Error('User not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  return updatedUser;
}

module.exports = {
  deleteUserService,
  updateUserService,
  updatePasswordService,
};
