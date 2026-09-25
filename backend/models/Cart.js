const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        {
            pizza: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pizza",
                required: true,
            },

            size: {
                type: String,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            price: {
                type: Number,
                required: true,
            },
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;