import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      console.log("Registration response: ", data);
      alert("Registration successful 🎉");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (error) {
      console.error("Registration error: ", error);
      alert(error.message);
    }
  };
  return (
    <div className="register-form-section">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create your account📝</h2>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="johndeo"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 92567850"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="register-btn">
          Create Account
        </button>
      </form>
      <p className="sub">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <p className="terms">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
