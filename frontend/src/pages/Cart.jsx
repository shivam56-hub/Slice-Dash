import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading) {
    return <h2>Loading Pizzas....</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1>Your Cart 🛒</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const updateQuantity = async (pizzaId, size, quantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pizzaId,
          size,
          quantity,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart");
      }

      setCart(data.cart);
    } catch (error) {
      alert(error.message);
    }
  };
  const removeItem = async (pizzaId, size) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/cart/item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pizzaId,
          size,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item");
      }

      setCart(data.cart);
    } catch (error) {
      alert(error.message);
    }
  };

  const cartTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <div className="cart-section">
      <div className="cart-container">
        <div className="cart-header">
          <p>YOUR ORDER</p>
          <h1>Your Cart 🛒</h1>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div className="cart-item" key={`${item.pizza._id}-${item.size}`}>
                <div className="cart-image">
                  <img src={item.pizza.image} alt={item.pizza.name} />
                </div>

                <div className="cart-item-content">
                  <div className="cart-item-top">
                    <div>
                      <h3>{item.pizza.name}</h3>
                      <p className="cart-size">Size: {item.size}</p>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => {
                        console.log("Pizza ID:", item.pizza._id);
                        console.log("Size:", item.size);

                        removeItem(item.pizza._id, item.size);
                      }}
                    >
                      Remove 🗑️
                    </button>
                  </div>

                  <p className="cart-price">₹{item.price}</p>

                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.pizza._id,
                            item.size,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.pizza._id,
                            item.size,
                            item.quantity + 1,
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="item-total">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
              
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹50</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal + 50}</span>
            </div>

            <Link to="/checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
           
}
