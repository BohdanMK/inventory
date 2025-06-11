const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await Product.countDocuments();

    const { name, category, status } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const products = await Product.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('category', 'name')
      .populate('status', 'name')
      .sort({ createdAt: -1 });

    res.json({
      data: products,
      total,
      page,
      perPage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, image, imagePath, category, status } = req.body;
    const newProduct = new Product({ name, image, imagePath, category, status });
    const savedProduct = await newProduct.save();

    setTimeout(() => {
      res.status(201).json({
        data: savedProduct,
        message: 'Product successfully created',
      });
    }, 600);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, image, imagePath, category, status } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, image, imagePath, category, status },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    setTimeout(() => {
      res.status(201).json({
        data: updatedProduct,
        message: 'Product successfully updated',
      });
    }, 600);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
