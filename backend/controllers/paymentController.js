const { message } = require("statuses");
const razorpay = require("../config/razorPay");
const crypto = require("crypto");

const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured yet.",
      });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "valid amount is required.",
      });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Message details are required.",
      });
    }
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id} | ${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
