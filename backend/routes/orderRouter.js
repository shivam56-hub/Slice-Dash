const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/",authMiddleware, orderController.createOrder);
router.get("/",authMiddleware, orderController.getOrders);
router.get("/:id",authMiddleware, orderController.getOrder);
router.put("/:id",authMiddleware, orderController.updateOrder);
router.delete("/:id",authMiddleware, orderController.deleteOrder);

module.exports = router;