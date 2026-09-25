const { message } = require("statuses");
const Cart = require("../models/Cart");
const Pizza = require("../models/Pizza");

// function of cart
const addToCart = async (req, res) => {
  const { pizzaId, size, quantity } = req.body;
  if (!pizzaId || !size || !quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "pizzaId, size and quantity are required.",
    });
  }
  const userId = req.user.id;

  try {
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "pizza not found.",
      });
    }
    // Find selected size
    const selectedSize = pizza.size.find((item) => item.name === size);

    if (!selectedSize) {
      return res.status(400).json({
        success: false,
        message: "Selected size not available.",
      });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.pizza.toString() === pizzaId && item.size === size,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        pizza: pizzaId,
        size: size,
        quantity: quantity,
        price: selectedSize.price,
      });
    }
    await cart.save();

    const updatedCart = await Cart.findOne({
      user: userId,
    }).populate("items.pizza");

    return res.status(200).json({
      success: true,
      message: "Pizza added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// function of get cart

const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.pizza");
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "cart found.",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { pizzaId, size, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.pizza.toString() === pizzaId && item.size === size,
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "cart item not found.",
      });
    }
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: userId,
    }).populate("items.pizza");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "cart deleted successfully! ",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeCart = async (req, res) => {
  const userId = req.user.id;
  const { pizzaId, size } = req.body;
  console.log("Delete body: ", req.body);
  if (!pizzaId || !size) {
    return res.status(400).json({
      success: false,
      message: "pizzaId and size are required.",
    });
  }
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart not found",
      });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.pizza.toString() === pizzaId && item.size === size,
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "cart not found",
      });
    }
    cart.items.splice(itemIndex, 1);

    await cart.save();
    const updatedCart = await Cart.findOne({
      user: userId,
    }).populate("items.pizza");
    return res.status(200).json({
      success: true,
      message: "Pizza remove from cart",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeCart,
  deleteCart,
};
