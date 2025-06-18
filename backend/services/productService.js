// services/productService.js
const Product = require('../models/Product');

const getProducts = async (queryParams) => {
  const all = queryParams.all === 'true';
  const page = parseInt(queryParams.page) || 1;
  const perPage = parseInt(queryParams.perPage) || 10;

  const { name, category, status } = queryParams;
  const filter = {};

  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const query = Product.find(filter)
    .populate('category', 'name')
    .populate('status', 'name')
    .sort({ createdAt: -1 });

  if (!all) {
    query.skip((page - 1) * perPage).limit(perPage);
  }

  const [products, total] = await Promise.all([
    query.exec(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, perPage };
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (data) => {
  const newProduct = new Product(data);
  return await newProduct.save();
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
