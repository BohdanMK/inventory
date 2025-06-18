const User = require('../models/User');

async function getUsersService({ page = 1, perPage = 10, role, username }) {
  page = parseInt(page);
  perPage = parseInt(perPage);

  const query = {};
  if (role) query.role = role;
  if (username) query.username = { $regex: username, $options: 'i' };

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return { users, total, page, perPage };
}

module.exports = {
  getUsersService,
};