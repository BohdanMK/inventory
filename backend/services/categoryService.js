// services/categoryService.js

const Category = require('../models/Category');

const getAllCategoriesService = async (queryParams) => {
  const all = queryParams.all === 'true';
  const page = parseInt(queryParams.page) || 1;
  const perPage = parseInt(queryParams.perPage) || 10;
  const { name } = queryParams;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };

  const query = Category.find(filter).sort({ createdAt: -1 });
  if (!all) {
    query.skip((page - 1) * perPage).limit(perPage);
  }

  const [categories, total] = await Promise.all([
    query.exec(),
    Category.countDocuments(filter)
  ]);

  return { categories, total, page, perPage };
};

const addCategoryService = async (name) => {
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new Error('Category already exists');
  }

  const newCategory = new Category({ name });
  await newCategory.save();
};

const editCategoryService = async (id, name) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!updatedCategory) {
    throw new Error('Category not found');
  }

  return updatedCategory;
};

const deleteCategoryService = async (id) => {
  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    throw new Error('Category not found');
  }
};

module.exports = {
  getAllCategoriesService,
  addCategoryService,
  editCategoryService,
  deleteCategoryService,
};
