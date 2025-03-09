import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navigation.css';
import logo from './logo1.jpeg'; // Importing logo1.png

export default function Navigation() {
    const { user, logout } = useContext(AuthContext);
    const [showLogo, setShowLogo] = useState(true); // State to toggle logo

    return (
        <nav className="navbar">
            {/* Left Section */}
            <div className="nav-left">
                <div className="logo-container" onClick={() => setShowLogo(!showLogo)}>
                    {showLogo && <img src={logo} alt="Logo" className="nav-logo" />}
                </div>
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                {!user && <Link to="/register">Join Us</Link>}
                {user?.role === "user" && <Link to="/cart">My Interests</Link>}
                {user?.role === "admin" && <Link to="/add-product">Add New</Link>}
            </div>

            {/* Right Section */}
            <div className="nav-right">
                {user ? (
                    <Link onClick={logout} className="logout-btn">Logout</Link>
                ) : (
                    <Link to="/login" className="login-btn">Login</Link>
                )}
            </div>
        </nav>
    );
}
