import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import "../styles/AdminManageOrder.css"


export default function AdminOrders() {
  const { token, isLoggedIn } = useAuth();

  const [updatingOrder, setUpdatingOrder] = useState(null);
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
        const response = await fetch("http://localhost:5000/api/orders/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "failed to fetch orders");
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
  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderStatus: status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? data.order : order)),
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingOrder(null);
    }
  };
  if (loading) {
    return <h2>Loading orders...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-heading">
        <h1>Manage Orders 📦</h1>
        <p>View and manage customer orders</p>
      </div>

      <div className="admin-orders-list">
        {orders.map((order) => (
          <div className="admin-order-card" key={order._id}>
            <div className="admin-order-header">
              <div className="order-id">
                <span>Order ID</span>
                <h3>#{order._id.slice(-8)}</h3>
              </div>
              <p className="admin-order-date">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

              <select
                className="admin-order-status"
                value={order.orderStatus}
                disabled={updatingOrder === order._id}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out_of_delivery">Out of delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="admin-delivery">
              <h4>Delivery Address</h4>

              <p>{order.deliveryAddress?.fullname}</p>

              <p>
                {order.deliveryAddress?.address}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} -{" "}
                {order.deliveryAddress?.pincode}
              </p>

              <p>Phone: {order.deliveryAddress?.phone}</p>
            </div>

            <div className="admin-orders-items">
              <h4>Items</h4>

              {order.items.map((item) => (
                <div className="admin-order-item" key={item._id}>
                  <span>
                    {item.name} — {item.size} × {item.quantity}
                  </span>

                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div className="admin-order-footer">
              <div>
                <span>Payment</span>
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

              <div>
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
