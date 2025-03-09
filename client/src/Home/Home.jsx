import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Importing CSS file

export default function Home() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get("https://hackathon-jsaa.onrender.com/api/product");
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products", err);
    }
  }

  async function addCart(productId) {
    if (!user || !user.token) {
      alert("Please log in first");
      return;
    }
    try {
      await axios.post(
        "https://hackathon-jsaa.onrender.com/api/cart/add",
        { productId },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert("Organisation added to your interests");
      navigate("/cart");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="home-container">
      <h2 className="title">Organizations</h2>
      <div className="products-grid">
        {products.map((productItem) => (
          <div key={productItem._id} className="product-card">
            <h3>{productItem.name}</h3>
            <p><b>Amount:</b> {productItem.price}</p>
            <p><b>Description:</b> {productItem.description}</p>
            <p><b>Requirement:</b> {productItem.category}</p>
            <p><b>Quantity:</b> {productItem.stock}</p>
            {user && user.role === "user" && (
              <button className="add-cart-btn" onClick={() => addCart(productItem._id)}>
                Donate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
