const GoodsReceipt = require('../models/GoodsReceipt');
const ProductInStock = require('../models/ProductInStock');
const Product = require('../models/Product'); // шаблон товару

const getGoodsReceipt = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await GoodsReceipt.countDocuments();

    const goodsReceipt = await GoodsReceipt.find()
      .populate('warehouse', 'name')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });


    setTimeout(() => {
        res.json({
          data: goodsReceipt,
          total,
          page,
          perPage
        });
    }, 500)
  } catch (error) {
    console.error('Помилка при отриманні поставок:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
}

const getGoodsReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    const goodsReceipt = await GoodsReceipt.findById(id).populate('warehouse', 'name');

    if (!goodsReceipt) {
      return res.status(404).json({ message: 'Поставка не знайдена' });
    }

    res.json(goodsReceipt);
  } catch (error) {
    console.error('Помилка при отриманні поставки по ID:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};


const createGoodsReceipt = async (req, res) => {
  try {
    if (typeof req.body.warehouse === 'object' && req.body.warehouse.code) {
      req.body.warehouse = req.body.warehouse.code;
    }
    const { warehouse, products, comment } = req.body;

    // Знімок товарів

    const snapshotProducts = await Promise.all(products.map(async (prod) => {
      const product = await Product.findById(prod._id).populate('category status');
      return {
        name: product.name,
        count: prod.count,
        price: prod.price,
        image: product.image,
        imagePath: product.imagePath,
        category: product.category?.name || '',
        status: product.status?.name || ''
      };
    }));

    // Створення поставки
    const receipt = await GoodsReceipt.create({
      warehouse,
      comment,
      products: snapshotProducts
    });

    // Створення записів в стоку
    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      const product = await Product.findById(prod._id).populate('category status');

      await ProductInStock.create({
        name: product.name,
        count: prod.count,
        price: prod.price,
        image: product.image,
        imagePath: product.imagePath,
        category: product.category?.name || '',
        status: product.status?.name || '',
        warehouse,
        goodsReceiptId: receipt._id,
        goodsReceiptName: receipt.name
      });
    }

    res.status(201).json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при створенні поставки' });
  }
};

module.exports = { createGoodsReceipt, getGoodsReceipt, getGoodsReceiptById };
