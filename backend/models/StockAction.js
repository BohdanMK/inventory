const mongoose = require('mongoose');

const StockProductSnapshotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0, default: 0 },
  image: String,
  imagePath: String,
  category: String,
  status: String
});

const StockActionSchema = new mongoose.Schema({
  typeAction: {
    type: String,
    required: true,
    enum: ['SHIPMENT', 'WRITEOFF', 'RETURN', 'CANCEL']
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [StockProductSnapshotSchema],
  comment: { type: String, required: true },
  fileName: String,
  filePath: String
}, {
  timestamps: true
});

module.exports = mongoose.model('StockAction', StockActionSchema);
