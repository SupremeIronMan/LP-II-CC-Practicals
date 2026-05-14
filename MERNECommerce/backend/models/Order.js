const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "COD", // Khalti | eSewa | PayPal later
    },

    paymentStatus: {
      type: String,
      default: "pending", // pending | paid | failed
    },

    orderStatus: {
      type: String,
      default: "processing", // processing | shipped | delivered
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
