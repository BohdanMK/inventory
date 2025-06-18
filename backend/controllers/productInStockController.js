const {
  getAllProductsInStockService,
  replaceProductInStockService,
} = require('../services/productInStockService');

const getAllProductsInStock = async (req, res) => {
  try {
    const result = await getAllProductsInStockService(req.query);

    setTimeout(() => {
      res.json(result);
    }, 1000);
  } catch (error) {
    console.error('Помилка при отриманні товарів на складі:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const replaceProductInStock = async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await replaceProductInStockService({ productId, ...req.body });

    res.json(result);
  } catch (error) {
    console.error('Помилка при переміщенні товару:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllProductsInStock,
  replaceProductInStock,
};
