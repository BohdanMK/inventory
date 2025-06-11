const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await Category.countDocuments();

    const categories = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    setTimeout(() => {
      res.json({
      data: categories,
      total,
      page,
      perPage
    });
    }, 500);
  } catch (error) {
    console.error('Помилка при отриманні категорій:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    setTimeout(() => {
      res.status(201).json({ message: 'Category created successfully' });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const editCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    setTimeout(() => {
      res.json({ message: 'Category updated', data: updatedCategory });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    setTimeout(() => {
      res.json({ message: 'Category deleted' });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete error' });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  editCategory,
  deleteCategory,
};