const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const tabs = new Map();
const onlineUsers = new Map();
const mongoose = require('mongoose');

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

    // ---------------- CHAT HISTORY ----------------
    socket.on('get-chat-history', async ({ userId }) => {
      if (!userId) {
        console.warn('❌ get-chat-history called without userId');
        socket.emit('chat-error', { message: 'UserId is required to load chat history' });
        return;
      }

      try {
        // НЕ використовуємо .lean() на populate реакцій
        const chatHistory = await ChatMessage.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('userId', 'username email avatarFullPath')
          .populate({
            path: 'replyTo',
            select: 'message userId deleted',
            populate: { path: 'userId', select: 'username avatarFullPath' }
          })
          .populate('reactions.userId', 'username avatarFullPath');

        const formattedHistory = chatHistory.reverse().map(msg => {
          const m = msg.toObject();
          return {
            _id: m._id,
            userId: m.userId?._id || m.userId,
            username: m.userId?.username || 'Unknown',
            avatar: m.userId?.avatarFullPath || null,
            message: m.deleted ? null : m.message,
            deleted: m.deleted || false,
            edited: m.edited || false,
            timestamp: m.createdAt,
            messageType: m.messageType,
            files: msg.files || [],
            reactions: Array.isArray(m.reactions) ? m.reactions.map(r => ({
              emoji: r.emoji,
              userId: r.userId?._id || r.userId,
              username: r.userId?.username || 'Unknown',
              avatar: r.userId?.avatarFullPath || null
            })) : [],
            replyTo: m.replyTo
              ? {
                  _id: m.replyTo._id,
                  message: m.replyTo.deleted ? null : m.replyTo.message,
                  userId: m.replyTo.userId?._id || m.replyTo.userId,
                  username: m.replyTo.userId?.username || 'Unknown',
                  avatar: m.replyTo.userId?.avatarFullPath || null,
                  deleted: m.replyTo.deleted,
                }
              : null,
          };
        });

        socket.emit('chat-history', formattedHistory);

      } catch (error) {
        console.error('❌ Error loading chat history:', error);
        socket.emit('chat-error', { message: 'Failed to load chat history' });
      }
    });

    // ---------------- SEND MESSAGE ----------------
    socket.on('send-message', async ({ message, userId, replyTo = null, files = [] }) => {
      try {
        if (!userId || (!message?.trim() && (!files || files.length === 0))) {
          socket.emit('chat-error', { message: 'userId і хоча б message або files обовʼязкові' });
          return;
        }

        const doc = new ChatMessage({
          userId,
          message: message?.trim() || null,
          messageType: files.length > 0 ? 'file' : 'text',
          replyTo: replyTo || null,
          files
        });

        const saved = await doc.save();
        const populated = await ChatMessage.findById(saved._id)
          .populate('userId', 'username email avatarFullPath')
          .populate({
            path: 'replyTo',
            select: 'message userId deleted',
            populate: { path: 'userId', select: 'username avatarFullPath' }
          })
          .lean();

        const formatted = formatMessage(populated);
        io.emit('new-message', formatted);
      } catch (error) {
        console.error('❌ Error saving message:', error);
        socket.emit('chat-error', { message: 'Failed to save message' });
      }
    });

    // ---------------- EDIT ----------------
    socket.on('edit-message', async ({ messageId, userId, newText }) => {
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
          .populate({
            path: 'replyTo',
            select: 'message userId deleted',
            populate: { path: 'userId', select: 'username avatarFullPath' }
          })
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
        msg.message = "Message deleted";
        await msg.save();

        io.emit('message-deleted', { _id: msg._id });
      } catch (err) {
        console.error('❌ Delete error:', err);
        socket.emit('chat-error', { message: 'Failed to delete message' });
      }
    });

    // ---------------- LOAD MORE ----------------
    socket.on('load-more-messages', async ({ before, limit = 20 }) => {
      try {
        const query = before ? { createdAt: { $lt: new Date(before) } } : {};

        const messages = await ChatMessage.find(query)
          .populate('userId', 'username email avatarFullPath')
          .populate({
            path: 'replyTo',
            select: 'message userId deleted',
            populate: { path: 'userId', select: 'username avatarFullPath' }
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

        const formattedMessages = messages.reverse().map(formatMessage);
        setTimeout(() => {
          socket.emit('more-messages', formattedMessages);
        }, 4000)
      } catch (error) {
        console.error('❌ Error loading more messages:', error);
        socket.emit('chat-error', { message: 'Failed to load more messages' });
      }
    });

    // ----------------REACT ON MESSAGE ---------------

    socket.on('react-message', async ({ messageId, userId, emoji }) => {
      try {

        if (!messageId || !userId || !emoji) {
          socket.emit('chat-error', { message: 'messageId, userId і emoji обовʼязкові' });
          return;
        }

        const msg = await ChatMessage.findById(messageId);
        if (!msg) {
          socket.emit('chat-error', { message: 'Message not found' });
          return;
        }


        msg.reactions = msg.reactions.filter(r => r.userId.toString() !== userId);


        msg.reactions.push({ emoji, userId: new mongoose.Types.ObjectId(userId) });

        await msg.save();

        const populated = await ChatMessage.findById(messageId)
          .populate('userId', 'username avatarFullPath')
          .populate('reactions.userId', 'username avatarFullPath')
          .lean();

        io.emit('message-reacted', formatMessage(populated));
      } catch (err) {
        console.error('❌ Reaction error:', err);
        socket.emit('chat-error', { message: 'Failed to react to message' });
      }
    });


    /// ------remove emoji ------

    socket.on('remove-react-message', async ({ messageId, userId, emoji }) => {
      try {

        if (!messageId || !userId || !emoji) {
          socket.emit('chat-error', { message: 'messageId, userId і emoji обовʼязкові' });
          return;
        }

        const msg = await ChatMessage.findById(messageId);
        if (!msg) {
          socket.emit('chat-error', { message: 'Message not found' });
          return;
        }


        msg.reactions = msg.reactions.filter(r => r.userId.toString() !== userId);

        await msg.save();

        const populated = await ChatMessage.findById(messageId)
          .populate('userId', 'username avatarFullPath')
          .populate('reactions.userId', 'username avatarFullPath')
          .lean();

        io.emit('message-reacted', formatMessage(populated));
      } catch (err) {
        console.error('❌ Reaction error:', err);
        socket.emit('chat-error', { message: 'Failed to react to message' });
      }
    });


    // ---------------- LOGOUT ----------------
    socket.on('logout-user', async ({ userId }) => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
        }
        await broadcastUsers();
      }
    });

    // ---------------- TABS ----------------
    socket.on('register-tab', ({ tabId, currentPage }) => {
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

    // ---------------- DISCONNECT ----------------
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

    // ---------------- HELPERS ----------------
    function broadcastTabs() {
      const tabList = Array.from(tabs.entries()).map(([id, data]) => ({
        id,
        route: data.route,
      }));
      io.emit('tabs-update', tabList);
    }

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
    }

    function formatMessage(msg) {
      return {
        _id: msg._id,
        userId: msg.userId?._id || msg.userId,
        username: msg.userId?.username || 'Unknown',
        avatar: msg.userId?.avatarFullPath || null,
        message: msg.deleted ? null : msg.message,
        deleted: msg.deleted || false,
        edited: msg.edited || false,
        timestamp: msg.createdAt,
        messageType: msg.messageType,
        reactions: Array.isArray(msg.reactions) ? msg.reactions.map(r => ({
          emoji: r.emoji,
          userId: r.userId?._id || r.userId,
          username: r.userId?.username || 'Unknown',
          avatar: r.userId?.avatarFullPath || null
        })) : [],
        replyTo: msg.replyTo
          ? {
              _id: msg.replyTo._id,
              message: msg.replyTo.deleted ? null : msg.replyTo.message,
              userId: msg.replyTo.userId?._id || msg.replyTo.userId,
              username: msg.replyTo.userId?.username || 'Unknown',
              avatar: msg.replyTo.userId?.avatarFullPath || null,
              deleted: msg.replyTo.deleted,
            }
          : null,
        files: msg.files || []
      };
    }
  });
};
