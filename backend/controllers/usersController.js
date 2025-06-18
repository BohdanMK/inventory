const { getUsersService } = require('../services/userService');

const getUsersController = async (req, res) => {
  try {
    const { page, perPage, role, username } = req.query;

    const { users, total, page: currentPage, perPage: currentPerPage } = await getUsersService({
      page,
      perPage,
      role,
      username,
    });

    setTimeout(() => {
      res.json({
        data: users,
        total,
        page: currentPage,
        perPage: currentPerPage,
      });
    }, 600);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers: getUsersController,
};
