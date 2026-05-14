// category routes
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// Get all Categories
router.get('/', categoryController.getAllCategories);
// Create a new Category
router.post('/', categoryController.createCategory);
// Get Category by ID
router.get('/:id', categoryController.getCategoryById);
// Update Category by ID
router.put('/:id', categoryController.updateCategoryById);
// Delete Category by ID
router.delete('/:id', categoryController.deleteCategoryById);
module.exports = router;