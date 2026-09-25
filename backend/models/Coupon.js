const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },

  discountType: {
    type: String,
    enum: ["Percentage", "Fixed"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },

  minimumOrder: {
    type: Number,
    default: 0,
  },

  maximumOrder: {
    type: Number,
  },

  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const couponModel = mongoose.model("Coupon", couponSchema);

module.exports = couponModel;
