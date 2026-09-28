import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  const handleLogout = () => {
    closeMenu();
    logout();
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SliceDash 🍕
        </Link>

        {/* {Hamburger Toggle Button for mobile} */}
        <button
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          {user?.role === "Admin" ? (
            <>
              <Link to="/admin" className="nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/admin/orders" className="nav-link" onClick={closeMenu}>
                Orders
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/pizzas" className="nav-link" onClick={closeMenu}>
                Pizzas
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/cart" className="nav-link" onClick={closeMenu}>
                    Cart
                  </Link>
                  <Link to="/orders" className="nav-link" onClick={closeMenu}>
                    Order
                  </Link>
                  <Link to="/contact" className="nav-link" onClick={closeMenu}>
                    Contact
                  </Link>
                  <button onClick={handleLogout} className="nav-button">
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link to="/login" className="nav-link" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="nav-link" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
