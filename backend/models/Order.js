const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      pizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pizza",
        required: true
        
      },
      name: String,
      size: String,
      quantity: Number,
      price: Number,
    },
  ],
  deliveryAddress: {
    fullname: String,
    phone: Number,
    address: String,
    city: String,
    state: String,
    pinCode: String,
  },
  subtotal: Number,
  deliveryFee: Number,
  discount: Number,
  totalAmount: Number,

  paymentMethod: {
    type: String,
    enum: ["Cash", "RazorPay"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,

  orderStatus: {
    type: String,
    enum: [
      "Placed",
      "Confirmed",
      "Preparing",
      "Out_of_delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
