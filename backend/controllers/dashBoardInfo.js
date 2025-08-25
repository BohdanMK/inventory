// controllers/dashBoardInfo.js

const {
  getTotalProductsService,
  getStockActionsSummaryService

} = require('../services/dashBoardInfoService');


const getTotalProducts = async (req, res) => {
  try {
    const { totalProducts, totalPrice } = await getTotalProductsService(req.query);
    setTimeout(() => {
        res.json({
          totalProducts,
          totalPrice
        });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні інформації про тотал продуктів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const getStockActionsSummary = async (req, res) => {
  try {
    const summary = await getStockActionsSummaryService(req.query);
    setTimeout(() => {
        res.json(summary);
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні інформації про тотал продуктів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

module.exports = {
    getTotalProducts,
    getStockActionsSummary
};