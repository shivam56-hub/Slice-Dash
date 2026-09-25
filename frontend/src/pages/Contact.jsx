import React, { useState } from "react";
import "../styles/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", formData);
    alert("Thank you! Your message has been sent.");
  };

  return (
    <section className="contact-section">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have a question about your order, delivery, or feedback? Drop us a line!</p>
      </div>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <div className="contact-info-wrapper">
          <div className="info-card">
            <div className="info-icon">📞</div>
            <div>
              <h3>Call Us</h3>
              <p>+91 98765 43210</p>
              <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div>
              <h3>Email Support</h3>
              <p>support@slicedash.com</p>
              <span>Response within 2 hours</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <div>
              <h3>Main Kitchen</h3>
              <p>123 Pizza Street, Foodie Zone</p>
              <span>New Delhi, Delhi</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="john deo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email / Phone</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="email@example.com or phone"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="orderId">Order ID (Optional)</label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  placeholder="#12345"
                  value={formData.orderId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="3"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}