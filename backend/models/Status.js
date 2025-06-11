const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {
    timestamps: true // Додається автоматично поле createdAt та updatedAt
});

module.exports = mongoose.model('Statuses', StatusSchema);