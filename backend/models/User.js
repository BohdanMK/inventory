const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, default: null }, // За замовчуванням null
    avatar: { type: String, default: null }, // За замовчуванням null
    avatarFullPath: { type: String, default: null }, // За замовчуванням null
    role: { type: String, enum: ['super_admin', 'user'], default: 'user' }
}, {
    timestamps: true // Додається автоматично поле createdAt та updatedAt
});

module.exports = mongoose.model('User', UserSchema);