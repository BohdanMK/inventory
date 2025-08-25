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
          messageType: msg.messageType
        }));

        socket.emit('chat-history', formattedHistory);
      } catch (error) {
        console.error('❌ Error loading chat history:', error);
        socket.emit('chat-error', { message: 'Failed to load chat history' });
      }
    });

    socket.on('send-message', async ({ message, userId }) => {
      try {

        const newMessage = new ChatMessage({
          userId: userId,
          message: message.trim(),
          messageType: 'text'
        });

        const savedMessage = await newMessage.save();

        const populatedMessage = await ChatMessage.findById(savedMessage._id)
          .populate('userId', 'username email avatarFullPath')
          .lean();


        const formattedMessage = {
          _id: populatedMessage._id,
          userId: populatedMessage.userId._id,
          username: populatedMessage.userId.username,
          avatar: populatedMessage.userId.avatarFullPath,
          message: populatedMessage.message,
          timestamp: populatedMessage.timestamp,
          messageType: populatedMessage.messageType
        };


        io.emit('new-message', formattedMessage);

        console.log('💬 New message saved and broadcast:', formattedMessage.username, ':', formattedMessage.message);
      } catch (error) {
        console.error('❌ Error saving message:', error);
        socket.emit('chat-error', { message: 'Failed to save message' });
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
    }
  });
};
