const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); 

// Get all Products
router.get('/', productController.getAllProducts);

// Get Products by category (MUST BE BEFORE :id)
router.get('/category/:categoryId', productController.getProductsByCategory);

// Create a new Product
router.post('/', upload.single('image'), productController.createProduct);

// Get Product by ID
router.get('/:id', productController.getProductById);

// Update Product by ID
router.put('/:id', upload.single('image'), productController.updateProductById);

// Delete Product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
