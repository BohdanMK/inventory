const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const tabs = new Map();
const onlineUsers = new Map();

module.exports = function (io) {
  io.on('connection', (socket) => {
        // ---------------- USERS ----------------
    socket.on('register-user', async ({ userId }) => {
      if (!onlineUsers.has(userId)) {
          console.log('📝 Registering user:', { userId });
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      await broadcastUsers();

    });

    /// get chat messssages

    socket.on('get-chat-history', async ({ userId }) => {

      if (!userId) {
        console.warn('❌ get-chat-history called without userId');
        socket.emit('chat-error', { message: 'UserId is required to load chat history' });
        return;
      }

      // load chat history
      try {
        const chatHistory = await ChatMessage.find()
          .populate('userId', 'username email avatarFullPath')
          .populate('replyTo', 'message userId')
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();


      const formattedHistory = chatHistory.reverse().map(msg => ({
          _id: msg._id,
          userId: msg.userId._id,
          username: msg.userId.username,
          avatar: msg.userId.avatarFullPath,
          message: msg.message,
          timestamp: msg.timestamp,
          messageType: msg.messageType,
          deleted: msg.deleted || false,
          replyTo: msg.replyTo
          ? {
              _id: msg.replyTo._id,
              message: msg.replyTo.message,
              userId: msg.replyTo.userId,
            }
          : null,
        }));

        socket.emit('chat-history', formattedHistory);
      } catch (error) {
        console.error('❌ Error loading chat history:', error);
        socket.emit('chat-error', { message: 'Failed to load chat history' });
      }
    });

      socket.on('send-message', async ({ message, userId, replyTo = null }) => {
      try {
        if (!userId || !message || !message.trim()) {
          socket.emit('chat-error', { message: 'userId and non-empty message are required' });
          return;
        }

        const doc = new ChatMessage({
          userId,
          message: message.trim(),
          messageType: 'text',
          replyTo: replyTo || null
        });

        const saved = await doc.save();
        const populated = await ChatMessage.findById(saved._id)
          .populate('userId', 'username email avatarFullPath')
          .populate('replyTo', 'message userId deleted')
          .lean();

        const formatted = formatMessage(populated);
        io.emit('new-message', formatted);
        // console.log('💬 New message:', formatted.username, ':', formatted.message);
      } catch (error) {
        console.error('❌ Error saving message:', error);
        socket.emit('chat-error', { message: 'Failed to save message' });
      }
    });

    // ---------------- EDIT ----------------
    socket.on('edit-message', async ({ messageId, newText, userId }) => {
      try {
        if (!messageId || !userId) {
          socket.emit('chat-error', { message: 'messageId and userId are required' });
          return;
        }
        const msg = await ChatMessage.findById(messageId);
        if (!msg) {
          socket.emit('chat-error', { message: 'Message not found' });
          return;
        }
        if (msg.userId.toString() !== userId) {
          socket.emit('chat-error', { message: 'Permission denied' });
          return;
        }
        if (msg.deleted) {
          socket.emit('chat-error', { message: 'Cannot edit deleted message' });
          return;
        }

        msg.message = (newText || '').trim();
        msg.edited = true;
        await msg.save();

        const populated = await ChatMessage.findById(messageId)
          .populate('userId', 'username email avatarFullPath')
          .populate('replyTo', 'message userId deleted')
          .lean();

        io.emit('message-updated', formatMessage(populated));
      } catch (err) {
        console.error('❌ Edit error:', err);
        socket.emit('chat-error', { message: 'Failed to edit message' });
      }
    });

    // ---------------- SOFT DELETE ----------------
    socket.on('delete-message', async ({ messageId, userId }) => {
      try {
        if (!messageId || !userId) {
          socket.emit('chat-error', { message: 'messageId and userId are required' });
          return;
        }
        const msg = await ChatMessage.findById(messageId);
        if (!msg) {
          socket.emit('chat-error', { message: 'Message not found' });
          return;
        }
        if (msg.userId.toString() !== userId) {
          socket.emit('chat-error', { message: 'Permission denied' });
          return;
        }

        msg.deleted = true;
        msg.message = "Message deleted"; // або "Message deleted"
        await msg.save();

        // Для узгодженості UI — або відправляємо мінімум, або весь формат
        io.emit('message-deleted', { _id: msg._id });
      } catch (err) {
        console.error('❌ Delete error:', err);
        socket.emit('chat-error', { message: 'Failed to delete message' });
      }
    });

    socket.on('load-more-messages', async ({ before, limit = 20 }) => {
      try {
        const query = before ? { timestamp: { $lt: new Date(before) } } : {};

        const messages = await ChatMessage.find(query)
          .populate('userId', 'username email avatarFullPath')
          .sort({ timestamp: -1 })
          .limit(limit)
          .lean();

        const formattedMessages = messages.reverse().map(msg => ({
          _id: msg._id,
          userId: msg.userId._id,
          username: msg.userId.username,
          avatar: msg.userId.avatarFullPath,
          message: msg.message,
          timestamp: msg.timestamp,
          messageType: msg.messageType
        }));

        socket.emit('more-messages', formattedMessages);
      } catch (error) {
        console.error('❌ Error loading more messages:', error);
        socket.emit('chat-error', { message: 'Failed to load more messages' });
      }
    });

    socket.on('logout-user', async ({ userId }) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
        }
        await broadcastUsers();
      }
    });


    // for tabs
    socket.on('register-tab', ({ tabId, currentPage }) => {
      // console.log('📝 Registering tab:', { tabId, currentPage });
      tabs.set(tabId, { socketId: socket.id, route: currentPage });
      broadcastTabs();
    });

    socket.on('update-tab', ({ tabId, currentPage }) => {
      if (tabs.has(tabId)) {
        tabs.set(tabId, { socketId: socket.id, route: currentPage });
        broadcastTabs();
      }
    });



    socket.on('remove-tab', ({ tabId }) => {
      if (tabs.has(tabId)) {
        tabs.delete(tabId);
        broadcastTabs();
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, sockets] of onlineUsers.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(userId);
          }
        }
      }
      broadcastUsers();

      for (const [tabId, data] of tabs.entries()) {
        if (data.socketId === socket.id) {
          tabs.delete(tabId);
        }
      }
      broadcastTabs();

    });

    function broadcastTabs() {
      const tabList = Array.from(tabs.entries()).map(([id, data]) => ({
        id,
        route: data.route,
      }));
      io.emit('tabs-update', tabList);
    };

    async function broadcastUsers() {
        const userIds = Array.from(onlineUsers.keys());


      const users = await User.find({ _id: { $in: userIds } })
        .select('_id username email avatarFullPath');

      io.emit('users-update', users.map(user => ({
        id: user._id,
        name: user.username,
        email: user.email,
        avatar: user.avatarFullPath,
      })));
    };

    function formatMessage(msg) {
      return {
        _id: msg._id,
        userId: msg.userId?._id || msg.userId,
        username: msg.userId?.username || 'Unknown',
        avatar: msg.userId?.avatarFullPath || null,
        message: msg.deleted ? null : msg.message, // якщо видалене — null
        deleted: msg.deleted || false,
        edited: msg.edited || false,
        timestamp: msg.timestamp,
        messageType: msg.messageType,
        replyTo: msg.replyTo
          ? {
              _id: msg.replyTo._id,
              message: msg.replyTo.deleted ? null : msg.replyTo.message,
              userId: msg.replyTo.userId,
              deleted: msg.replyTo.deleted,
            }
          : null,
      };
    }
  });
};
