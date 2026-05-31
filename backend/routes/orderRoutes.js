 const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

// CREATE ORDER
router.post(
  "/orders",
  verifyToken,
  createOrder
);

// GET USER ORDERS
router.get(
  "/orders/my-orders",
  verifyToken,
  getMyOrders
);

module.exports = router;