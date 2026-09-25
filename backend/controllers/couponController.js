const Coupon = require("../models/Coupon");

const createCoupon = async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minimumOrder,
    maximumOrder,
    expiryDate,
    isActive,
  } = req.body;
  if (!code || !discountType || !discountValue || !expiryDate) {
    return res.status(400).json({
      success: false,
      message: "code, discountType, discountValue and expiryDate are required.",
    });
  }

  if (discountValue <= 0) {
    return res.status(400).json({
      success: false,
      message: "Discount value must be greater than 0.",
    });
  }
  try {
    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minimumOrder,
      maximumOrder,
      expiryDate,
      isActive,
    });
    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({
      success: true,
      message: "Coupons found successfully.",
      coupons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon found successfully.",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "coupon not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "coupon updated successfully",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
