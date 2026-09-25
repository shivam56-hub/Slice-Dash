require("dotenv").config();
const express = require("express")
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");


const categoryRouter = require("./routes/categoryRoutes");
const pizzaRouter = require("./routes/pizzaRoutes");
const userRouter = require("./routes/userRouter");
const cartRouter = require("./routes/cartRouter");
const couponRouter = require("./routes/couponRouter");
const orderRouter = require("./routes/orderRouter");
const paymentRoutes = require("./routes/paymentRoutes");



const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10kb" }))

app.use("/api/categories",categoryRouter);
app.use("/api/pizzas",pizzaRouter);
app.use("/api/users",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponRouter);
app.use("/api/orders",orderRouter);
app.use("/api/payment",paymentRoutes)


app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});


const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT,() => {
        console.log(`Server is running on port:  ${PORT}`);
    })

})