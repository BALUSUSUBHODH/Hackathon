import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCartProducts();
        }
    }, [user]);

    async function fetchCartProducts() {
        try {
            const res = await axios.get("https://hackathon-jsaa.onrender.com/api/cart", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCart(res.data.products);
        } catch (err) {
            console.error("Error fetching your intrests:", err);
        }
    }

    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);

    function handleCheckout() {
        navigate("/checkout", { state: { cart } });
    }

    async function removeFromCart(productId) {
        try {
            const res = await axios.delete(`https://hackathon-jsaa.onrender.com/api/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCart(res.data.cart.products);
        } catch (err) {
            console.error("Error removing item from intrest:", err);
        }
    }

    if (!user) return <p className="cart-message">Please log in to view your intrests.</p>;

    return (
        <div className="cart-container">
            <h2>Your Intrests</h2>

            {cart.length === 0 ? (
                <p className="cart-message">No Intrests</p>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div key={item.productId._id} className="cart-item">
                            {/* Product Image */}
                            <img src={item.productId.imageUrl} alt={item.productId.name} className="cart-item-img" />

                            {/* Product Details */}
                            <div className="cart-item-details">
                                <h3>{item.productId.name}</h3>
                                <p><b>Quantity:</b> {item.quantity}</p>
                                <p><b>Price:</b> Rs. {item.productId.price}</p>
                                <p><b>Description:</b> {item.productId.description}</p>
                                <p><b>Total:</b> Rs. {(item.quantity * item.productId.price).toFixed(2)}</p>
                            </div>

                            {/* Remove Button */}
                            <button className="remove-btn" onClick={() => removeFromCart(item.productId._id)}>Remove</button>
                        </div>
                    ))}

                    {/* Total Price & Checkout */}
                    <h3 className="total-price">Total Price: Rs. {totalPrice.toFixed(2)}</h3>
                    <button className="checkout-btn" onClick={handleCheckout}>Proceed to Pay</button>
                </div>
            )}
        </div>
    );
}
