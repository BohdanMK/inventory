const Warehouse = require('../models/Warehouse');

async function getWarehousesService({ page = 1, perPage = 10, name }) {
  page = parseInt(page);
  perPage = parseInt(perPage);

  const filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };

  const total = await Warehouse.countDocuments(filter);

  const warehouses = await Warehouse.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return { warehouses, total, page, perPage };
}

async function getWarehouseByIdService(id) {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) {
    const err = new Error('Warehouse not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return warehouse;
}

async function createWarehouseService(data) {
  const newWarehouse = new Warehouse(data);
  const savedWarehouse = await newWarehouse.save();
  return savedWarehouse;
}

async function updateWarehouseService(id, data) {
  const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, data, { new: true });
  if (!updatedWarehouse) {
    const err = new Error('Warehouse not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return updatedWarehouse;
}

async function deleteWarehouseService(id) {
  const deletedWarehouse = await Warehouse.findByIdAndDelete(id);
  if (!deletedWarehouse) {
    const err = new Error('Warehouse not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return true;
}

module.exports = {
  getWarehousesService,
  getWarehouseByIdService,
  createWarehouseService,
  updateWarehouseService,
  deleteWarehouseService,
};
