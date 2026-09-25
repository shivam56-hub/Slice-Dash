// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/Footer.css"

// export default function Footer() {
//   return (
//     <div className="footer-section">
//       <div className="footer-container">
//         <div className="footer-info">
//           <h2>🍕 Pizza Delivery </h2>
//           <p>Fresh pizza delivered straight to your door. </p>
//           <div className="social-links">
//             <Link to="/" className="social-link">LinkedIN</Link>
//             <Link to="/" className="social-link">Github</Link>
//           </div>
//         </div>

//         <div className="footer-links">
//           <Link to="/" className="footer-link">Home</Link>
//           <Link to="/pizzas" className="footer-link">Pizzas</Link>
//           <Link to="/cart" className="footer-link">Cart</Link>
//           <Link to="/orders" className="footer-link">Order</Link>
//           <Link to="/login" className="footer-link">Login</Link>
//         </div>
//       </div>
//       <div className="footer-copyright-section">
//         <p>© 2026 Pizza Delivery </p>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-info">
          <h2>🍕 Pizza Delivery</h2>
          <p>Fresh pizza delivered straight to your door.</p>
          <div className="social-links">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              GitHub
            </a>
          </div>
        </div>

        <nav className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/pizzas" className="footer-link">Pizzas</Link>
          <Link to="/cart" className="footer-link">Cart</Link>
          <Link to="/orders" className="footer-link">My Orders</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </nav>
      </div>

      <div className="footer-copyright-section">
        <p>© {currentYear} Pizza Delivery. All rights reserved.</p>
      </div>
    </footer>
  );
}