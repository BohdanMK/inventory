const {
  getUsers: getUsersService,
  updateUser,
  updateUserAvatar,
  updateUserPassword,
  deleteUserById,
} = require('../services/profileService');

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const { role, username } = req.query;

    const { users, total } = await getUsersService({ page, perPage, role, username });

    setTimeout(() => {
      res.json({ data: users, total, page, perPage });
    }, 600);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = (req, res) => {
  res.json(req.user);
};

const updateCurrentUser = async (req, res) => {
  try {
    const updated = await updateUser(req.user._id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const updated = await updateUserAvatar(req.user.id, req.file);

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Avatar updated successfully',
      user: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const updated = await updateUserPassword(req.user._id, req.body.password);
    res.json({ data: updated, message: 'User password updated' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await deleteUserById(req.params.id);
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
