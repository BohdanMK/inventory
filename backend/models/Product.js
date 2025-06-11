const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    required: true,
    default: '1748040545172-placeholder.png'
  },
  imagePath: {
    type: String,
    required: true,
    default: 'uploads/1748040545172-placeholder.png'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Statuses',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
