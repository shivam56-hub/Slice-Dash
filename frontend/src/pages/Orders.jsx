import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Orders.css";

export default function Orders() {
  const { token, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn || !token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }
        setOrders(data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, isLoggedIn]);

  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }
  if (orders.length === 0) {
    return (
      <div>
        <h1>My Orders 📦</h1>
        <p>No orders found.</p>
      </div>
    );
  }

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order");
      }

      // Remove deleted order from UI
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="order-section">
      <div className="order-heading">
        <h1>My Orders 📦</h1>
        <p>Track and view your recent orders</p>
      </div>

      <div className="orders">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <div>
                <p className="order-label">Order ID</p>
                <h3>#{order._id.slice(-8)}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`order-status ${order.orderStatus?.toLowerCase()}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item._id}>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      {item.size} × {item.quantity}
                    </p>
                  </div>

                  <span className="item-price">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div>
                <span>Payment Method</span>
                <strong>
                  {order.paymentMethod === "Cash"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>{order.paymentStatus}</strong>
              </div>
              <div className="order-total">
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
            <div className="delete-section">
            <button
              className="delete-btn"
              onClick={() => handleDeleteOrder(order._id)}
            >
              Delete Order
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
