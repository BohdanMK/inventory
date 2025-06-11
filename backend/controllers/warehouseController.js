const Warehouse = require('../models/Warehouse');

const getWarehouses = async (req, res) => {
  try {
    const { name } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await Warehouse.countDocuments();

    const warehouses = await Warehouse.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({
        data: warehouses,
        total,
        page,
        perPage
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const { name, address, contact, contact_person } = req.body;
    const newWarehouse = new Warehouse({ name, address, contact, contact_person });
    const savedWarehouse = await newWarehouse.save();
    setTimeout(() => {
      res.status(201).json({ data: savedWarehouse, message: 'Warehouse successfully created' });
    }, 600);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const { name, address, contact, contact_person } = req.body;
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, address, contact, contact_person },
      { new: true }
    );

    if (!updatedWarehouse) return res.status(404).json({ message: 'Warehouse not found' });
    setTimeout(() => {
      res.status(201).json({ data: updatedWarehouse, message: 'Warehouse successfully updated' });
    }, 600);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!deletedWarehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ message: 'Warehouse deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
