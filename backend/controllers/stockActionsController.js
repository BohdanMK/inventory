const StockActionService = require('../services/stockActionService');

const getAllStockActions = async (req, res) => {
  try {
    const all = req.query.all === 'true';
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const filters = {
      typeAction: req.query.typeAction,
      warehouse: req.query.warehouse,
      description: req.query.description,
    };

    const { stockActions, total } = await StockActionService.getAll({ all, page, perPage, filters });

    setTimeout(() => {
      res.status(200).json({ data: stockActions, total, page, perPage });
    }, 800);
  } catch (error) {
    console.error('Помилка при отриманні stock actions:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

const getStockActionById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockAction = await StockActionService.getById(id);
    res.json(stockAction);
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Операцію не знайдена' });
    }
    console.error('Помилка при отриманні операції по ID:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const createStockAction = async (req, res) => {
  try {
    const typeAction = req.body.typeAction; // Припускаю, що тип дії передається у тілі
    const newAction = await StockActionService.create(req.body, typeAction);
    res.status(201).json({ message: 'Операцію виконано успішно', newAction });
  } catch (error) {
    if (error.code === 'BAD_REQUEST') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Помилка при створенні дії:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

module.exports = {
  getAllStockActions,
  getStockActionById,
  createStockAction,
};
