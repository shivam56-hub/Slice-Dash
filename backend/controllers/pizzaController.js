const Pizza = require("../models/Pizza");
require("../models/Category");

// Creating pizza
const createPizza = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      image,
      size,
      isVeg,
      isAvailable,
      rating,
    } = req.body;
    if (
      !name ||
      !description ||
      !category ||
      !image ||
      !size ||
      isVeg === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const pizza = await Pizza.create({
      name,
      description,
      category,
      image,
      size,
      isVeg,
      isAvailable,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "pizza Created successfully.",
      pizza,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All the Pizzas in one
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find().populate("category");

    return res.status(200).json({
      success: true,
      pizzas,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single pizza(only one)
const getPizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "pizza not found.",
      });
    }
    return res.status(200).json({
      success: true,
      pizza,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update pizza
const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Pizza updated successfully.",
      pizza,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete pizza

const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "pizza not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Pizza deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createPizza,
  getPizzas,
  getPizza,
  updatePizza,
  deletePizza,
};
