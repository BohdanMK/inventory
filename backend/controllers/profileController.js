const User = require('../models/User');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await User.countDocuments();

    const { role, username } = req.query;

    const query = {};
    if (role) query.role = role;
    if (username) query.username = { $regex: username, $options: 'i' };

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    setTimeout(() => {
      res.json({
          data: users,
          total,
          page,
          perPage
      });
    }, 600)
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = (req, res) => {
  res.json(req.user);
};

const updateCurrentUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { username, email, role } },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { fileName, filePath } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: fileName, avatarFullPath: filePath } },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { password: hashedPassword } },
      { new: true }
    ).select('-password');
    res.json({ data: updatedUser, message: 'User password updated' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete error' });
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  updateAvatar,
  updatePassword,
  deleteUser,
};
