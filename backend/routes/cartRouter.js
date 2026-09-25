const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()

router.post("/", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCart);
router.put("/",authMiddleware, cartController.updateCart);
router.delete("/item",authMiddleware, cartController.removeCart);
router.delete("/",authMiddleware, cartController.deleteCart);


module.exports = router;