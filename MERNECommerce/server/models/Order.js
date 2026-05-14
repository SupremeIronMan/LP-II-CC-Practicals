const mongoose = require("mongoose");

const orderLineSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Guest",
    },
    items: {
      type: [orderLineSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, "Order needs items."],
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
