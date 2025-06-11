const ProductInStock = require('../models/ProductInStock');

const getAllProductsInStock = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await ProductInStock.countDocuments();

    const { name, category, status } = req.query;

    const filter = { outStock: false };

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const productsInStock = await ProductInStock.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('warehouse', 'name')
    .sort({ createdAt: -1 });

    setTimeout(() => {
      res.json({
      data: productsInStock,
      total,
      page,
      perPage
    });
    }, 1000);
  } catch (error) {
    console.error('Помилка при отриманні товарів на складі:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const replaceProductInStock = async (req, res) => {
  try {
    const { oldWarehouse, warehouse, count, comment } = req.body;
    const productId = req.params.productId;

    if (!oldWarehouse || !warehouse || !count) {
      return res.status(400).json({ message: 'Недостатньо даних' });
    }

    // Витягуємо _id або code (як ObjectId у вигляді рядка) з переданих об'єктів або рядків
    const oldWarehouseId =
      typeof oldWarehouse === 'object'
        ? (oldWarehouse._id || oldWarehouse.code)
        : oldWarehouse;

    const newWarehouseId =
      typeof warehouse === 'object'
        ? (warehouse._id || warehouse.code)
        : warehouse;

    // Перевірка, чи обидва ID є валідними ObjectId рядками
    if (
      !/^[0-9a-fA-F]{24}$/.test(oldWarehouseId) ||
      !/^[0-9a-fA-F]{24}$/.test(newWarehouseId)
    ) {
      return res.status(400).json({ message: 'Невірний формат складу (warehouse)' });
    }

    // Знайти товар на старому складі
    const oldProduct = await ProductInStock.findOne({
      warehouse: oldWarehouseId,
      _id: productId,
    });

    if (!oldProduct || oldProduct.count < count) {
      return res.status(400).json({ message: 'Недостатньо товару на складі' });
    }

    // Зменшити кількість на старому складі
    oldProduct.count -= count;

    if (oldProduct.count === 0) {
        // Якщо товару не лишилось — видалити запис
        await oldProduct.deleteOne();
    } else {
        await oldProduct.save();
    }

    // Спроба знайти товар на новому складі
    let newProduct = await ProductInStock.findOne({
      warehouse: newWarehouseId,
      name: oldProduct.name,
      price: oldProduct.price,
      category: oldProduct.category,
      status: oldProduct.status,
      image: oldProduct.image,
      imagePath: oldProduct.imagePath,
      goodsReceiptId: oldProduct.goodsReceiptId,
    });

    if (newProduct) {
      newProduct.count += count;
    } else {
      newProduct = new ProductInStock({
        name: oldProduct.name,
        price: oldProduct.price,
        count,
        image: oldProduct.image,
        imagePath: oldProduct.imagePath,
        category: oldProduct.category,
        status: oldProduct.status,
        warehouse: newWarehouseId,
        goodsReceiptId: oldProduct.goodsReceiptId,
        goodsReceiptName: oldProduct.goodsReceiptName,
      });
    }

    await newProduct.save();

    res.json({ success: true, message: 'Товар успішно переміщено' });
  } catch (error) {
    console.error('Помилка при переміщенні товару:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

module.exports = {
  getAllProductsInStock,
  replaceProductInStock,
};
