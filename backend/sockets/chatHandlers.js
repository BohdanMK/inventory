const ChatMessage = require('../models/ChatMessage');
const mongoose = require('mongoose');
const { formatMessage } = require('../utils/formatMessage');

module.exports = function(io, socket) {
  // ---------------- CHAT HISTORY ----------------
  socket.on('get-chat-history', async ({ userId }) => {
    if (!userId) {
      socket.emit('chat-error', { message: 'UserId is required to load chat history' });
      return;
    }

    try {
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

      const formattedHistory = chatHistory.reverse().map(formatMessage);
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

      io.emit('new-message', formatMessage(populated));
    } catch (error) {
      console.error('❌ Error saving message:', error);
      socket.emit('chat-error', { message: 'Failed to save message' });
    }
  });

  // ---------------- EDIT MESSAGE ----------------
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

  // ---------------- DELETE MESSAGE ----------------
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
      socket.emit('more-messages', formattedMessages);
    } catch (error) {
      console.error('❌ Error loading more messages:', error);
      socket.emit('chat-error', { message: 'Failed to load more messages' });
    }
  });

  // ---------------- REACT TO MESSAGE ----------------
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

  // ---------------- REMOVE REACTION ----------------
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
      socket.emit('chat-error', { message: 'Failed to remove reaction' });
    }
  });
};
