const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("items.product", "name price");
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: "Invalid order id." });
  }
});

/**
 * Simulated checkout: validates stock, decrements inventory, stores an order.
 * Body: { customerName?: string, items: { productId: string, quantity: number }[] }
 */
router.post("/", async (req, res) => {
  const { customerName, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart must include at least one line." });
  }

  const normalized = [];
  for (const line of items) {
    const productId = line.productId || line.product;
    const quantity = Number(line.quantity);
    if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Each item needs a valid productId and quantity." });
    }
    normalized.push({ productId, quantity: Math.floor(quantity) });
  }

  const rollback = [];

  try {
    const orderLines = [];
    let total = 0;

    for (const { productId, quantity } of normalized) {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updated) {
        for (const r of rollback) {
          await Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } });
        }
        return res.status(400).json({
          message: "Insufficient stock or product missing. Nothing was charged.",
        });
      }

      rollback.push({ id: productId, qty: quantity });
      const lineTotal = updated.price * quantity;
      total += lineTotal;
      orderLines.push({
        product: updated._id,
        name: updated.name,
        quantity,
        unitPrice: updated.price,
      });
    }

    const order = await Order.create({
      customerName: (customerName && String(customerName).trim()) || "Guest",
      items: orderLines,
      total: Math.round(total * 100) / 100,
      status: "completed",
    });

    return res.status(201).json(order);
  } catch (error) {
    for (const r of rollback) {
      await Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } });
    }
    return res.status(500).json({ message: "Checkout failed. Try again." });
  }
});

module.exports = router;
