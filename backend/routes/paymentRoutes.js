const express = require("express");
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/create-order",
    authMiddleware,
    paymentController.createRazorpayOrder
);
router.post(
    "/verify",
    authMiddleware,paymentController.verifyPayment
);

module.exports = router;