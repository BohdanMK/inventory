const {
  getAllStatuses,
  createNewStatus,
  updateExistingStatus,
  deleteExistingStatus,
} = require('../services/statusService');

const getStatuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const { statuses, total } = await getAllStatuses(page, perPage);

    setTimeout(() => {
      res.json({ data: statuses, total, page, perPage });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні статусів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const createStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const created = await createNewStatus(name);

    if (!created.success) {
      return res.status(400).json({ message: created.message });
    }

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

    const updated = await updateExistingStatus(req.params.id, name);

    if (!updated) {
      return res.status(404).json({ message: 'Status not found' });
    }

    setTimeout(() => {
      res.json({ message: 'Status updated', data: updated });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update error' });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const deleted = await deleteExistingStatus(req.params.id);

    if (!deleted) {
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
