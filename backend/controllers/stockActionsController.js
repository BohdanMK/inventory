const StockAction = require('../models/StockAction');
const ProductInStock = require('../models/ProductInStock');

exports.getStockActionById = async (req, res) => {
  try {
    const { id } = req.params;

    const stockAction = await StockAction
      .findById(id)
      .populate('user', 'name email')
      .populate('warehouse', 'name');

    if (!stockAction) {
      return res.status(404).json({ message: 'Операція не знайдена' });
    }

    res.json(stockAction);
  } catch (error) {
    console.error('Помилка при отриманні поставки по ID:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};


exports.getAllStockActions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await StockAction.countDocuments();

    const stockActions = await StockAction.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('user', 'name email')
      .populate('warehouse', 'name')
      .sort({ createdAt: -1 });

    setTimeout(() => {

      res.status(200).json({
        data: stockActions,
        total,
        page,
        perPage
      });
    }, 800);
  } catch (error) {
    console.error('Помилка при отриманні stock actions:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

exports.getStockActionById = async (req, res) => {
  try {
    const { id } = req.params;

    const stockAction = await StockAction.findById(id)
      .populate('warehouse', 'name')
      .populate('user', 'name email');

    if (!stockAction) {
      return res.status(404).json({ message: 'Операцію не знайдена' });
    }

    res.json(stockAction);
  } catch (error) {
    console.error('Помилка при отриманні операції по ID:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

exports.createStockAction = async (req, res, typeAction) => {
  try {
    const { warehouse, products, comment, fileName, filePath, user } = req.body;
    console.log(req.body);

    if (!user || !warehouse || !Array.isArray(products) || products.length === 0 || !comment) {
      return res.status(400).json({ message: 'Обовʼязкові поля: warehouse, products[], comment' });
    }

    const snapshotProducts = [];

    for (const { product: productId, count, price } of products) {
      if (!productId || typeof count !== 'number') {
        return res.status(400).json({ message: 'Невірний формат товарів у списку' });
      }

      const productInStock = await ProductInStock.findById(productId);
      if (!productInStock) {
        return res.status(404).json({ message: `Товар не знайдено: ${productId}` });
      }

      if (String(productInStock.warehouse) !== warehouse) {
        return res.status(400).json({ message: `Товар ${productId} не належить до складу` });
      }

      // Оновлення складу у разі списання
      if (['SHIPMENT', 'WRITEOFF', 'RETURN', 'CANCEL'].includes(typeAction)) {
        if (productInStock.count < count) {
          return res.status(400).json({ message: `Недостатньо товару для ${productId}` });
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
        status: productInStock.status
      });
    }

    const newAction = new StockAction({
      typeAction,
      warehouse,
      user,
      products: snapshotProducts,
      comment,
      fileName,
      filePath
    });

    await newAction.save();

    res.status(201).json({ message: 'Операцію виконано успішно', newAction });
  } catch (error) {
    console.error('Помилка при створенні дії:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};
