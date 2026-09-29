import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css"

export default function AdminDashboard() {
      const { token, isLoggedIn } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoggedIn || !token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch dashboard stats");
        }

        setStats(data.stats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
},[token, isLoggedIn]);
if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <h1>Admin Dashboard 📊</h1>
        <p>Overview of your SliceDash store</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>Total Orders</span>
          <h2>{stats.totalOrders}</h2>
        </div>

        <div className="stat-card">
          <span>Total Revenue</span>
          <h2>₹{stats.totalRevenue}</h2>
        </div>

        <div className="stat-card">
          <span>Total Customers</span>
          <h2>{stats.totalCustomers}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Orders</span>
          <h2>{stats.pendingOrders}</h2>
        </div>
      </div>
    </div>
  );
}
