const User = require('../models/User');
const bcrypt = require('bcrypt');

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, username, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, username, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    setTimeout(() => {
      res.json({ message: 'User updated', data: updatedUser });
    }, 1000);
  } catch (error) {
    res.status(500).json({ message: 'Update error' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    if (!password || password.length < 3) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    setTimeout(() => {
      res.json({ data: updatedUser, message: 'User password updated' });
    }, 400);
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  deleteUser,
  updateUser,
  updatePassword,
};
