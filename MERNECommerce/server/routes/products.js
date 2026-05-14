const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product id." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create product." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (stock !== undefined) update.stock = Number(stock);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update product." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid product id." });
  }
});

module.exports = router;
