import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';  

export default function Register() {
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", mobile: ""
    });
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("https://hackathon-jsaa.onrender.com/api/auth/signup", formData)
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                setUser({ token: res.data.token, role: res.data.role });
                navigate("/");
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="register-container">
            <form className="register-form">
                <h2>Sign Up</h2>
                <input type="text" placeholder="Name" name="username" onChange={handleChange} />
                <input type="email" placeholder="Email ID" name="email" onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                <input type="text" placeholder="Mobile Number" name="mobile" onChange={handleChange} />
                <button onClick={handleSubmit}>Register</button>
            </form>
        </div>
    );
}