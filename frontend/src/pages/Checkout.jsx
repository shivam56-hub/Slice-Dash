import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import razorpay from "../../../backend/config/razorPay";
import "../styles/Checkout.css"

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please login first.");
        }
        const response = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cart");
        }
        setCart(data.cart);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const items = cart?.items || [];
  const subTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress({
      ...address,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Delivery Address:", address);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      // Load Razorpay Checkout
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      // Create Razorpay order
      const response = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalAmount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment order");
      }

      console.log("Razorpay Order:", data.order);
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Pizza Delivery",
        description: "Pizza Order",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");

            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            }
            console.log("Payment verified:", verifyData);

            // alert("Payment verified successfully 🎉");
            const orderResponse = await fetch(
              "http://localhost:5000/api/orders/after-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  deliveryAddress: address,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                }),
              },
            );
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
              throw new Error(orderData.message || "Failed to create order");
            }
            console.log("Order created: ", orderData);
            alert("Order placed successfully 🎉");

            // using navigate
            navigate("/orders");
          } catch (error) {
            console.error("Verification error:", error);
            alert(error.message);
          }
        },
        prefill: {
          name: address.fullname,
          contact: address.phone,
        },

        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message);
    }
  };
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  if (loading) {
    return <h2>Loading checkout...</h2>;
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1>Checkout🧾</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

return (
  <div className="checkout-section">
    <div className="checkout-container">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order and enjoy your pizza 🍕</p>
      </div>

      <div className="checkout-layout">

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="form-data">

          <div className="section-title">
            <span>📍</span>
            <div>
              <h2>Delivery Information</h2>
              <p>Enter your delivery details</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={address.fullname}
                onChange={handleChange}
                placeholder="John deo"
                required
              />
            </div>

            <div className="form">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="+91 8968356487"
                required
              />
            </div>

            <div className="form full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={address.address}
                onChange={handleChange}
                placeholder="New Delhi Near metro Station."
                rows="3"
                required
              />
            </div>

            <div className="form">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="New Delhi"
                required
              />
            </div>

            <div className="form">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="Delhi"
                required
              />
            </div>

            <div className="form">
              <label>Pin Code</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="256264"
                required
              />
            </div>

          </div>

          <button type="submit" className="form-btn">
            Continue to Payment →
          </button>

        </form>

        {/* Order Summary */}
        <div className="order-summary">

          <div className="section-title">
            <span>🧾</span>
            <div>
              <h2>Order Summary</h2>
              <p>{items.length} item(s) in your order</p>
            </div>
          </div>

          <div className="summary-items">
            {items.map((item) => (
              <div
                className="summary-item"
                key={`${item.pizza}-${item.size}`}
              >
                <div>
                  <h3>{item.name || "Pizza"}</h3>
                  <p>
                    {item.size} × {item.quantity}
                  </p>
                </div>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="price-details">
            <div>
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>

            <div>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="total-row">
              <span>Total</span>
              <strong>₹{totalAmount}</strong>
            </div>
          </div>

          <div className="secure-payment">
            🔒 Secure payment powered by Razorpay
          </div>

        </div>

      </div>
    </div>
  </div>
);

}
