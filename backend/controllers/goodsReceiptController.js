const {
  getGoodsReceiptService,
  getGoodsReceiptByIdService,
  createGoodsReceiptService,
} = require('../services/goodsReceiptService');

const getGoodsReceipt = async (req, res) => {
  try {
    const { goodsReceipt, total, page, perPage } = await getGoodsReceiptService(req.query);

    setTimeout(() => {
      res.json({ data: goodsReceipt, total, page, perPage });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні поставок:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const getGoodsReceiptById = async (req, res) => {
  try {
    const receipt = await getGoodsReceiptByIdService(req.params.id);
    res.json(receipt);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createGoodsReceipt = async (req, res) => {
  try {
    const receipt = await createGoodsReceiptService(req.body);
    res.status(201).json(receipt);
  } catch (error) {
    console.error('Помилка при створенні поставки:', error);
    res.status(500).json({ message: 'Помилка при створенні поставки' });
  }
};

module.exports = {
  getGoodsReceipt,
  getGoodsReceiptById,
  createGoodsReceipt,
};
