// services/dashBoardInfoService.js
const ProductInStock = require('../models/ProductInStock');
const StockAction = require('../models/StockAction');

const getTotalProductsService = async (query) => {
  const { warehouse } = query;

  const match = { outStock: false };

  if (warehouse) {
    match.warehouse = warehouse;
  }

  const result = await ProductInStock.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: '$count' },
        totalPrice: { $sum: { $multiply: ['$count', '$price'] } }
      }
    }
  ]);

  return {
    totalProducts: result.length ? result[0].totalProducts : 0,
    totalPrice: result.length ? result[0].totalPrice : 0
  };
};

const getStockActionsSummaryService = async (query) => {
  const { warehouse, month, year } = query;

  const match = {};

  if (warehouse) {
    match.warehouse = warehouse;
  }

  if (month && year) {
    const startDate = new Date(year, month - 1, 1); // перший день місяця
    const endDate = new Date(year, month, 1); // перший день наступного місяця
    match.createdAt = { $gte: startDate, $lt: endDate };
  }

  const result = await StockAction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$typeAction',
        count: { $sum: 1 }
      }
    }
  ]);

  const actions = ['SHIPMENT', 'WRITEOFF', 'RETURN', 'CANCEL'];
  const formatted = actions.map(action => {
    const found = result.find(r => r._id === action);
    return {
      type: action,
      count: found ? found.count : 0
    };
  });

  return formatted;
};

module.exports = {
  getTotalProductsService,
  getStockActionsSummaryService
};
