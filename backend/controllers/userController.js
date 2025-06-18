const {
  deleteUserService,
  updateUserService,
  updatePasswordService
} = require('../services/userService');

const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Delete error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, username, role } = req.body;
    const updatedUser = await updateUserService(req.params.id, { email, username, role });

    setTimeout(() => {
      res.json({ message: 'User updated', data: updatedUser });
    }, 1000);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Update error' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const updatedUser = await updatePasswordService(req.params.id, password);

    setTimeout(() => {
      res.json({ data: updatedUser, message: 'User password updated' });
    }, 400);
  } catch (error) {
    if (error.code === 'BAD_REQUEST') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  deleteUser,
  updateUser,
  updatePassword,
};
