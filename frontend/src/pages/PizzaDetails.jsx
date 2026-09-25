import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PizzaDetails.css";

export default function PizzDetails() {
  const { id } = useParams();

  const [pizza, setPizzas] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pizzas/${id}`);
        if (!response.ok) {
          throw new Error("Pizza not found");
        }

        const data = await response.json();
        setPizzas(data.pizza);

        // select first size by default
        if (data.pizza.size.length > 0) {
          setSelectedSize(data.pizza.size[0].name);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, [id]);

  if (loading) {
    return <h2>Loading Pizzas....</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }

  const selectedSizeData = pizza.size.find(
  (item) => item.name === selectedSize
);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pizzaId: pizza._id,
          size: selectedSize,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add pizza to cart");
      }
      alert("Pizza added to cart🛒.");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="details-section">
      <div className="details-image">
        <img src={pizza.image} alt={pizza.name} />
      </div>
      <div className="details-content">
        <h3>{pizza.name}</h3>
        <p>{pizza.description}</p>
        <p>Category: {pizza.category?.name || "No category"}</p>
        <div className="detail-card-info">
          <div className="rating">
          <p> {pizza.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</p>
          <p>Rating: ⭐{pizza.rating}</p>
          </div>
          <h3>Select Size</h3>
          <div className="cart-size">
            {pizza.size.map((item) => (
              <button
                key={item._id}
                onClick={() => setSelectedSize(item.name)}
                className={`size-btn ${
                  selectedSize === item.name ? "active" : ""
                }`}
              >
                {item.name} - ₹{item.price}
              </button>
            ))}
          </div>
          <div className="quantity">
            <h3>Quantity</h3>
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="quantity-btn">
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((prev) => prev + 1)} className="quantity-btn"> + </button>
          </div>
          <h3 className="total">
            Total: ₹{selectedSizeData ? selectedSizeData.price * quantity : 0}
          </h3>
          <button onClick={handleAddToCart} className="add-btn">
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
