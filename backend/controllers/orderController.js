const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

// const createOrder = async (req, res) => {
//   const userId = req.user.id;
//   const { addressId, paymentMethod } = req.body;
//   if (!addressId) {
//     return res.status(400).json({
//       success: false,
//       message: "addressId is required.",
//     });
//   }
//   if (paymentMethod !== "Cash") {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid payment method.",
//     });
//   }

//   try {
//     const cart = await Cart.findOne({
//       user: userId,
//     }).populate("items.pizza");

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found.",
//       });
//     }

//     if (cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty.",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     const selectedAddress = user.addresses.id(addressId);

//     if (!selectedAddress) {
//       return res.status(404).json({
//         success: false,
//         message: "Address not found.",
//       });
//     }

//     const orderItems = cart.items.map((item) => ({
//       pizza: item.pizza._id,
//       name: item.pizza.name,
//       size: item.size,
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const subTotal = cart.items.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0,
//     );

//     const deliveryFee = 50;
//     const discount = 0;

//     const totalAmount = subTotal + deliveryFee - discount;

//     const order = await Order.create({
//       user: userId,
//       items: orderItems,

//       deliveryAddress: {
//         fullname: selectedAddress.fullname,
//         phone: selectedAddress.phone,
//         address: selectedAddress.address,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         pincode: selectedAddress.pincode,
//       },

//       subtotal: subTotal,
//       deliveryFee,
//       discount,
//       totalAmount,

//       paymentMethod: "Cash",
//       paymentStatus: "Pending",
//       orderStatus: "Placed",
//     });

//     await Cart.findOneAndDelete({ user: userId });

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { deliveryAddress, paymentMethod } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({
      success: false,
      message: "Delivery address is required.",
    });
  }

  if (paymentMethod !== "Cash") {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method.",
    });
  }

  try {
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.pizza");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    const orderItems = cart.items.map((item) => ({
      pizza: item.pizza._id,
      name: item.pizza.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    const subTotal = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const deliveryFee = 50;
    const discount = 0;
    const totalAmount = subTotal + deliveryFee - discount;

    const order = await Order.create({
      user: userId,
      items: orderItems,

      deliveryAddress: {
        fullname: deliveryAddress.fullname,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pincode,
      },

      subtotal: subTotal,
      deliveryFee,
      discount,
      totalAmount,

      paymentMethod: "Cash",
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    await Cart.findOneAndDelete({
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    .populate("user", "name email phone")
    .populate("items.pizza","name image");

    return res.status(200).json({
      success: true,
      message: " All Orders found successfully.",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders found successfully.",
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order found successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {$ne: "Cancelled"},
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount"}
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

     const pendingOrders = await Order.countDocuments({
      orderStatus: {
        $in: ["Placed", "Confirmed", "Preparing", "Out_for_delivery"],
      },
    });
    const customers = await Order.distinct("user");
    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers: customers.length,
        pendingOrders,
      },
    });
  }catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  const userId = req.user.id;

  // order status
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res.status(400).json({
      success: false,
      message: "orderStatus is required.",
    });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { orderStatus },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!["Placed", "Confirmed"].includes(order.orderStatus)){
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled now."
      })
    }
    order.orderStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrders,
  getOrder,
  getOrderStats,
  updateOrder,
  cancelOrder,
  deleteOrder,
};
