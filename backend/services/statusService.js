const Status = require('../models/Status');

const getAllStatuses = async (page, perPage) => {
  const total = await Status.countDocuments();
  const statuses = await Status.find()
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  return { statuses, total };
};

const createNewStatus = async (name) => {
  const existing = await Status.findOne({ name });
  if (existing) {
    return { success: false, message: 'Status already exists' };
  }

  const newStatus = new Status({ name });
  await newStatus.save();

  return { success: true };
};

const updateExistingStatus = async (id, name) => {
  return await Status.findByIdAndUpdate(id, { name }, { new: true });
};

const deleteExistingStatus = async (id) => {
  return await Status.findByIdAndDelete(id);
};

module.exports = {
  getAllStatuses,
  createNewStatus,
  updateExistingStatus,
  deleteExistingStatus,
};
