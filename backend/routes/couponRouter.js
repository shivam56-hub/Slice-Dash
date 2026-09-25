const express = require("express");

const couponController = require("../controllers/couponController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  couponController.createCoupon,
);

router.get("/", couponController.getCoupons);
router.get("/:id", couponController.getCoupon);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  couponController.updateCoupon,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  couponController.deleteCoupon,
);



module.exports = router;