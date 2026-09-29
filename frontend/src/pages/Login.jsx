import React, { useState } from "react";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log("login response: ", data);

      login(data.token);

      alert("login successful 🎉");
      navigate("/");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("login error: ", error);
      alert(error.message);
    }
  };
  
  return (
    <div className="login-form-section">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login 📝</h2>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="johndeo@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p className="sub">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
