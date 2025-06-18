const GoodsReceipt = require('../models/GoodsReceipt');
const ProductInStock = require('../models/ProductInStock');
const Product = require('../models/Product');

const getGoodsReceiptService = async (query) => {
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;

  const { name, warehouse } = query;
  const filter = {};

  if (name) filter.name = { $regex: name, $options: 'i' };
  if (warehouse) filter.warehouse = warehouse;

  const total = await GoodsReceipt.countDocuments(filter);

  const goodsReceipt = await GoodsReceipt.find(filter)
    .populate('warehouse', 'name')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return { goodsReceipt, total, page, perPage };
};

const getGoodsReceiptByIdService = async (id) => {
  const receipt = await GoodsReceipt.findById(id).populate('warehouse', 'name');

  if (!receipt) {
    throw new Error('Поставка не знайдена');
  }

  return receipt;
};

const createGoodsReceiptService = async (data) => {
  let { warehouse, products, comment } = data;

  if (typeof warehouse === 'object' && warehouse.code) {
    warehouse = warehouse.code;
  }

  // Створення снапшотів товарів
  const snapshotProducts = await Promise.all(
    products.map(async (prod) => {
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
    })
  );

  const receipt = await GoodsReceipt.create({
    warehouse,
    comment,
    products: snapshotProducts
  });

  // Запис у ProductInStock
  for (const prod of products) {
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

  return receipt;
};

module.exports = {
  getGoodsReceiptService,
  getGoodsReceiptByIdService,
  createGoodsReceiptService,
};
