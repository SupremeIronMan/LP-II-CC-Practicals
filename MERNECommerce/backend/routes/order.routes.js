const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);        // Create Order
router.get("/", getAllOrders);         // Admin
router.get("/:id", getOrderById);      // Single Order

module.exports = router;
