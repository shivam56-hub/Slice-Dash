const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema (
{
    name: String,
    email: String,
    password: String,
    phone: Number,
    role: {
        type: String,
        enum: ["User","Admin"],
        default: "User"
    },

    addresses: [
        {
            fullname: String,
            phone: Number,
            address: String,
            city: String,
            state: String,
            pincode: String
        }
    ],
    createdAt: Date
});

const userModel = mongoose.model("User", UserSchema)

module.exports = userModel;