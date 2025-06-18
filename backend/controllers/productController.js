// controllers/productController.js
const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const { products, total, page, perPage } = await productService.getProducts(req.query);
    res.json({ data: products, total, page, perPage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const savedProduct = await productService.createProduct(req.body);
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
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

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
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

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
