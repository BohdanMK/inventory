const Status = require('../models/Status');

const getStatuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await Status.countDocuments();

    const statuses = await Status.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    setTimeout(() => {
      res.json({
        data: statuses,
        total,
        page,
        perPage
      });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні статусів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const createStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const existingStatus = await Status.findOne({ name });
    if (existingStatus) {
      return res.status(400).json({ message: 'Status already exists' });
    }

    const newStatus = new Status({ name });
    await newStatus.save();

    setTimeout(() => {
      res.status(201).json({ message: 'Status created successfully' });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedStatus = await Status.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: 'Status not found' });
    }

    setTimeout(() => {
      res.json({ message: 'Status updated', data: updatedStatus });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update error' });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const deletedStatus = await Status.findByIdAndDelete(req.params.id);

    if (!deletedStatus) {
      return res.status(404).json({ message: 'Status not found' });
    }

    setTimeout(() => {
      res.json({ message: 'Status deleted' });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete error' });
  }
};

module.exports = {
  getStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
};
