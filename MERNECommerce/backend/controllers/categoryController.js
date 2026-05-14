// Controll for category
const Category = require('../models/Category');

// get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();   
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// create a new Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;  
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  } 
};

// get Category By Id 
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// delete Category By Id
exports.deleteCategoryById = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  }
    catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// update Category By Id
exports.updateCategoryById = async (req, res) => {
  try { 
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
        { name },
        { new: true }
    );
    res.status(200).json(updatedCategory);
  }
    catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    }
};
