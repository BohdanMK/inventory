const StockAction = require('../models/StockAction');
const ProductInStock = require('../models/ProductInStock');

class StockActionService {
  static async getAll({ all, page, perPage, filters }) {
    const filter = {};

    if (filters.warehouse) filter.warehouse = filters.warehouse;
    if (filters.typeAction) filter.typeAction = filters.typeAction;
    if (filters.description) filter.comment = filters.description;

    const query = StockAction.find(filter)
      .populate('user', 'name email')
      .populate('warehouse', 'name')
      .sort({ createdAt: -1 });

    if (!all) {
      query.skip((page - 1) * perPage).limit(perPage);
    }

    const [stockActions, total] = await Promise.all([
      query.exec(),
      StockAction.countDocuments(filter),
    ]);

    return { stockActions, total, page, perPage };
  }

  static async getById(id) {
    const stockAction = await StockAction.findById(id)
      .populate('warehouse', 'name')
      .populate('user', 'name email');

    if (!stockAction) {
      throw new Error('NOT_FOUND');
    }

    return stockAction;
  }

  static async create({ warehouse, products, comment, fileName, filePath, user }, typeAction) {
    if (!user || !warehouse || !Array.isArray(products) || products.length === 0 || !comment) {
      const err = new Error('Обовʼязкові поля: warehouse, products[], comment');
      err.code = 'BAD_REQUEST';
      throw err;
    }

    const snapshotProducts = [];

    for (const { product: productId, count, price } of products) {
      if (!productId || typeof count !== 'number') {
        const err = new Error('Невірний формат товарів у списку');
        err.code = 'BAD_REQUEST';
        throw err;
      }

      const productInStock = await ProductInStock.findById(productId);
      if (!productInStock) {
        const err = new Error(`Товар не знайдено: ${productId}`);
        err.code = 'NOT_FOUND';
        throw err;
      }

      if (String(productInStock.warehouse) !== warehouse) {
        const err = new Error(`Товар ${productId} не належить до складу`);
        err.code = 'BAD_REQUEST';
        throw err;
      }

      if (['SHIPMENT', 'WRITEOFF', 'RETURN', 'CANCEL'].includes(typeAction)) {
        if (productInStock.count < count) {
          const err = new Error(`Недостатньо товару для ${productId}`);
          err.code = 'BAD_REQUEST';
          throw err;
        }
        if (!productInStock.outStock) {
          productInStock.count -= count;
          if (productInStock.count === 0) {
            productInStock.outStock = true;
          }
          await productInStock.save();
        }
      }

      snapshotProducts.push({
        name: productInStock.name,
        count,
        price,
        image: productInStock.image,
        imagePath: productInStock.imagePath,
        category: productInStock.category,
        status: productInStock.status,
      });
    }

    const newAction = new StockAction({
      typeAction,
      warehouse,
      user,
      products: snapshotProducts,
      comment,
      fileName,
      filePath,
    });

    await newAction.save();

    return newAction;
  }
}

module.exports = StockActionService;
