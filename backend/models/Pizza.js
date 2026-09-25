const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  size: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],

  isVeg: {
    type: Boolean,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const pizzaModel = mongoose.model("Pizza", pizzaSchema);

module.exports = pizzaModel;
