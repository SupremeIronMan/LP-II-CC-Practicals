// Controll for product
const Product = require('../models/Product');

// get all Products 
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();   
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// create a new Product
exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, qty } = req.body;

    if (!title || !price || !description || !category || !qty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      title,
      price,
      description,
      category,
      qty,
      image: req.file ? req.file.filename : null,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// get Product By Id 
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// delete Product By Id
exports.deleteProductById  = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  }
    catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// update Product By Id
exports.updateProductById = async (req, res) => {
  try { 
    const { title, price, description, category, status, qty } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
        { title, price, description, category, status, qty },
        { new: true }
    );
    res.status(200).json(updatedProduct);
  }
    catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    }
};

// get Products By Category Id
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};