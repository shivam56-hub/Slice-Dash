import React, { useEffect, useState } from "react";
import { getPizzas } from "../services/api";
import "../styles/Home.css"

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getPizzas();
        setPizzas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  if (loading) {
    return <h2>Loading Pizzas....</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-container">
          <p className="hero-small-title">FRESH • HOT • DELICIOUS</p>
          <h1>Welcome to SliceDash🍕</h1>

          <p className="hero-description">
            Freshly baked pizzas delivered straight to your door.
          </p>
        </div>
      </section>

      <section className="home-pizzas">
        <div className="home-container">
          <div className="section-heading">
            <p>EXPLORE OUR MENU</p>
            <h2>Our Pizzas</h2>
          </div>

          {pizzas.length === 0 ? (
            <p className="empty-pizzas">No pizzas available.</p>
          ) : (
            <div className="home-pizza-grid">
              {pizzas.map((pizza) => (
                <div className="home-pizza-card" key={pizza._id}>
                  <div className="pizza-image-wrapper">
                    <img src={pizza.image} alt={pizza.name} width="200" />
                  </div>
                  <div className="pizza-card-content">
                    <h3>{pizza.name}</h3>

                    <p className="pizza-description">{pizza.description}</p>

                    <p className="pizza-category">
                      Category: {pizza.category?.name || "No category"}
                    </p>
                    <div className="pizza-info">
                      <span> {pizza.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
                      <span>Rating: ⭐{pizza.rating}</span>
                    </div>
                    <h4>Size & Price</h4>
                    <div className="pizza-prices">
                      {pizza.size.map((item) => (
                        <span key={item._id}>
                          {item.name} - ₹{item.price}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
