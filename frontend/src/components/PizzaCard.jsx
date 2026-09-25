import React from "react";
import { Link } from "react-router-dom";
import "../styles/PizzaCard.css";

export default function PizzaCard({ pizza }) {
  return (
    <div className="card-section">
      <div className="pizza-image">
        <img src={pizza.image} alt={pizza.name} />
      </div>
      <div className="card-content">
        <h3>{pizza.name}</h3>
        <p className="card-description">{pizza.description}</p>

        <p className="card-category">
          Category: {pizza.category?.name || "No category"}
        </p>
        <div className="card-info">
          <p> {pizza.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</p>
          <p>Rating: ⭐{pizza.rating}</p>
        </div>
        <h4>Size & Price</h4>
        
        {pizza.size.map((item) => (
          <p key={item._id} className="card-price">
            {item.name} - ₹{item.price}
          </p>
        ))}
        <Link to={`/pizzas/${pizza._id}`}>
          <button className="view-btn">View details</button>
        </Link>
      </div>
    </div>
  );
}
