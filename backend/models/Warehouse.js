const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, default: null },
    contact: { type: String, default: null },
    contact_person: { type: String, default: null }
}, {
    timestamps: true // Додається автоматично поле createdAt та updatedAt
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);