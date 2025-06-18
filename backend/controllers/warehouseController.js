const {
  getWarehousesService,
  getWarehouseByIdService,
  createWarehouseService,
  updateWarehouseService,
  deleteWarehouseService,
} = require('../services/warehouseService');

const getWarehouses = async (req, res) => {
  try {

    const { warehouses, total, page, perPage } = await getWarehousesService(req.query);

    setTimeout(() => {
      res.json({
        data: warehouses,
        total,
        page,
        perPage,
      });
    }, 500);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await getWarehouseByIdService(req.params.id);
    res.json(warehouse);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const savedWarehouse = await createWarehouseService(req.body);
    setTimeout(() => {
      res.status(201).json({ data: savedWarehouse, message: 'Warehouse successfully created' });
    }, 600);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const updatedWarehouse = await updateWarehouseService(req.params.id, req.body);
    setTimeout(() => {
      res.status(201).json({ data: updatedWarehouse, message: 'Warehouse successfully updated' });
    }, 600);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    await deleteWarehouseService(req.params.id);
    res.json({ message: 'Warehouse deleted' });
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
