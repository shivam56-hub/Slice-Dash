import React, { useEffect, useState } from "react";
import { getPizzas } from "../services/api";
import PizzaCard from "../components/PizzaCard";
import "../styles/Pizzas.css"
import Spinner from "../loaders/Spinner";



export default function Pizzas() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getPizzas();
        setPizzas(data);
      } catch (error) {
        console.log("Pizza error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);
  if (loading) {
    return <Spinner /> ;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  return (
    <div className="pizza-section">
      <h1>Our Pizzas🍕</h1>

      {pizzas.length === 0 ? (
        <p className="Pizza-message">No Pizzas available.</p>
      ) : (
        <div className="grid-templates">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
}
