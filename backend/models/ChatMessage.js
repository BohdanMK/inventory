const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
    reactions: {
        type: [{
            emoji: { type: String, trim: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }],
        default: []
    }
}, { timestamps: true });

chatMessageSchema.index({ createdAt: -1 });


module.exports = mongoose.model('ChatMessage', chatMessageSchema);
