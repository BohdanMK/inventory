// controllers/categoryController.js

const {
  getAllCategoriesService,
  addCategoryService,
  editCategoryService,
  deleteCategoryService,
} = require('../services/categoryService');

const getAllCategories = async (req, res) => {
  try {
    const { categories, total, page, perPage } = await getAllCategoriesService(req.query);

    setTimeout(() => {
      res.json({
        data: categories,
        total,
        page,
        perPage,
      });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні категорій:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const addCategory = async (req, res) => {
  try {
    await addCategoryService(req.body.name);

    setTimeout(() => {
      res.status(201).json({ message: 'Category created successfully' });
    }, 1000);
  } catch (error) {
    const message = error.message === 'Category already exists' ? error.message : 'Server error';
    res.status(400).json({ message });
  }
};

const editCategory = async (req, res) => {
  try {
    const updatedCategory = await editCategoryService(req.params.id, req.body.name);

    setTimeout(() => {
      res.json({ message: 'Category updated', data: updatedCategory });
    }, 1000);
  } catch (error) {
    const message = error.message === 'Category not found' ? error.message : 'Update error';
    res.status(400).json({ message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await deleteCategoryService(req.params.id);

    setTimeout(() => {
      res.json({ message: 'Category deleted' });
    }, 1000);
  } catch (error) {
    const message = error.message === 'Category not found' ? error.message : 'Delete error';
    res.status(400).json({ message });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  editCategory,
  deleteCategory,
};
