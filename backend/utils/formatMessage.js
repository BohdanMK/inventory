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
    reactions: Array.isArray(msg.reactions)
      ? msg.reactions.map(r => ({
          emoji: r.emoji,
          userId: r.userId?._id || r.userId,
          username: r.userId?.username || 'Unknown',
          avatar: r.userId?.avatarFullPath || null
        }))
      : [],
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

module.exports = { formatMessage };
