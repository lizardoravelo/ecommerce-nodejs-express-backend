const Category = require('../model/category');
const handleErrorResponse = require('../middleware/error-handler');

const categoryCtrl = {};

categoryCtrl.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

categoryCtrl.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

categoryCtrl.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const newCategory = await new Category({ name, description }).save();
    res.status(201).json({
      message: 'Category Created Successfully',
      category: newCategory,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

categoryCtrl.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }, // return the updated document and run validation
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({
      message: 'Category Updated Successfully',
      category: updatedCategory,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = categoryCtrl;
