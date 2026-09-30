import React, { useEffect, useState } from "react";
import "../styles/AddPizza.css"

export default function AddPizza() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
    isVeg: true,
    isAvailable: true,
  });
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories`,
        );
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories: ", error);
      }
    };
    fetchCategories();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="addPizza-section">
      <div className="addPizza">
        <h1>Add New Pizza 🍕</h1>
      </div>
      <form onSubmit={handleSubmit} className="addPizza-form">
        <div>
          <label>Pizza Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter the pizz name"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Pizza Description"
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter pizza image URL "
            required
          />
        </div>
        <div className="price-section">
        <div>
          <label>Small Price</label>
          <input
            type="number"
            name="smallPrice"
            value={formData.smallPrice}
            onChange={handleChange}
            placeholder="99"
            min="0"
            required
          />
        </div>
        <div>
          <label>Medium Price</label>
          <input
            type="number"
            name="mediumPrice"
            value={formData.mediumPrice}
            onChange={handleChange}
            placeholder="249"
            min="0"
            required
          />
        </div>
        <div>
          <label>Large Price</label>
          <input
            type="number"
            name="largePrice"
            value={formData.largePrice}
            onChange={handleChange}
            placeholder="349"
            min="0"
            required
          />
        </div>
        </div>
        <div className="checkboxes-section">
        <div className="addPizza-checkboxes">
          <label className="addPizza-checkbox">
            <input
              type="checkbox"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
            />
            <span>Vegetarian</span>
          </label>
        {/* </div> */}
        {/* <div className="addPizza-checkboxes"> */}
          <label className="addPizza-checkbox">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>
        </div>
        </div>
         <button type="submit" className="addPizza-btn">Add Pizza</button>
      </form>
    </div>
  );
}
