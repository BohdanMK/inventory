const mongoose = require('mongoose');

const ProductInStockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true },
    price: { type: Number, required: true },
    image: String,
    imagePath: String,
    category: String,
    status: String,
    outStock: {
        type: Boolean,
        default: false
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    goodsReceiptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoodsReceipt',
        required: true
    },
    goodsReceiptName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductInStock', ProductInStockSchema);