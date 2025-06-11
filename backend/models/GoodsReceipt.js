const mongoose = require('mongoose');

const ReceivedProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  price: { type: Number, required: true },
  image: String,
  imagePath: String,
  category: String,
  status: String
});

const GoodsReceiptSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  comment: { type: String, default: '' },
  products: [ReceivedProductSchema],
  name: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

GoodsReceiptSchema.pre('save', async function (next) {
  if (!this.name) {
    const warehouse = await mongoose.model('Warehouse').findById(this.warehouse);
    const now = new Date().toLocaleString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    this.name = `Надходження на склад "${warehouse.name}" від ${now}`;
  }
  next();
});

module.exports = mongoose.model('GoodsReceipt', GoodsReceiptSchema);