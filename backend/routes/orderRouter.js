const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router();

router.post("/",authMiddleware, orderController.createOrder);
router.post("/:id/cancel", authMiddleware, orderController.cancelOrder);
router.get("/",authMiddleware, orderController.getOrders);
router.get("/admin",authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get("/admin/stats",authMiddleware, adminMiddleware, orderController.getOrderStats);
router.get("/:id",authMiddleware, orderController.getOrder);
router.put("/:id",authMiddleware, adminMiddleware, orderController.updateOrder);
router.delete("/:id",authMiddleware, orderController.deleteOrder);

module.exports = router;