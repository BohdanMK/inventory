const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUsers = async ({ page = 1, perPage = 10, role, username }) => {
  const query = {};
  if (role) query.role = role;
  if (username) query.username = { $regex: username, $options: 'i' };

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return { users, total };
};

const getUserById = async (userId) => {
  return User.findById(userId).select('-password');
};

const updateUser = async (userId, { username, email, role }) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: { username, email, role } },
    { new: true }
  ).select('-password');
};

const updateUserAvatar = async (userId, file) => {
  const fileName = file.filename;
  const filePath = `uploads/${fileName}`;

  return User.findByIdAndUpdate(
    userId,
    {
      avatar: fileName,
      avatarFullPath: filePath,
    },
    { new: true }
  ).select('-password');
};

const updateUserPassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findByIdAndUpdate(
    userId,
    { $set: { password: hashedPassword } },
    { new: true }
  ).select('-password');
};

const deleteUserById = async (userId) => {
  return User.findByIdAndDelete(userId);
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  updateUserPassword,
  deleteUserById,
};
