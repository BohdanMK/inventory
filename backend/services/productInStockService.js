const ProductInStock = require('../models/ProductInStock');
const { getSortOptions } = require('../utils/sortUtils');

const getAllProductsInStockService = async (query) => {
  const all = query.all === 'true';
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;

  const { name, category, status, warehouse, price, quantity } = query;

  const filter = { outStock: false };

  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category) filter.category = category;
  if (warehouse) filter.warehouse = warehouse;
  if (price) filter.price = price;
  if (quantity) filter.count = quantity;
  if (status) filter.status = status;

  const sortOptions = getSortOptions(query.sortBy);

  const mongoQuery = ProductInStock.find(filter).populate('warehouse', 'name').sort(sortOptions);

  if (!all) {
    mongoQuery.skip((page - 1) * perPage).limit(perPage);
  }

  const [productsInStock, total] = await Promise.all([
    mongoQuery.exec(),
    ProductInStock.countDocuments(filter)
  ]);

  return {
    data: productsInStock,
    total,
    page: all ? 1 : page,
    perPage: all ? productsInStock.length : perPage,
  };
};

const replaceProductInStockService = async ({ productId, oldWarehouse, warehouse, count, comment }) => {
  const oldWarehouseId =
    typeof oldWarehouse === 'object'
      ? (oldWarehouse._id || oldWarehouse.code)
      : oldWarehouse;

  const newWarehouseId =
    typeof warehouse === 'object'
      ? (warehouse._id || warehouse.code)
      : warehouse;

  if (
    !/^[0-9a-fA-F]{24}$/.test(oldWarehouseId) ||
    !/^[0-9a-fA-F]{24}$/.test(newWarehouseId)
  ) {
    throw new Error('Невірний формат складу');
  }

  const oldProduct = await ProductInStock.findOne({
    warehouse: oldWarehouseId,
    _id: productId,
  });

  if (!oldProduct || oldProduct.count < count) {
    throw new Error('Недостатньо товару на складі');
  }

  oldProduct.count -= count;

  if (oldProduct.count === 0) {
    await oldProduct.deleteOne();
  } else {
    await oldProduct.save();
  }

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

  return { success: true, message: 'Товар успішно переміщено' };
};

module.exports = {
  getAllProductsInStockService,
  replaceProductInStockService,
};
