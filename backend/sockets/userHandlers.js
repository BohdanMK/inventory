const User = require('../models/User');
const onlineUsers = new Map();

module.exports = function(io, socket) {
  socket.on('register-user', async ({ userId }) => {
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    await broadcastUsers(io);
  });

  socket.on('logout-user', async ({ userId }) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).delete(socket.id);
      if (onlineUsers.get(userId).size === 0) onlineUsers.delete(userId);
    }
    await broadcastUsers(io);
  });

  socket.on('disconnect', async () => {
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
      }
    }
    await broadcastUsers(io);
  });
};

async function broadcastUsers(io) {
  const userIds = Array.from(onlineUsers.keys());
  const users = await User.find({ _id: { $in: userIds } })
    .select('_id username email avatarFullPath');

  io.emit('users-update', users.map(user => ({
    id: user._id,
    name: user.username,
    email: user.email,
    avatar: user.avatarFullPath,
  })));
}