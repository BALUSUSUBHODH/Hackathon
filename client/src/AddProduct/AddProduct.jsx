import React, { useContext, useState } from 'react'
import axios from "axios"
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import "./AddProduct.css";

export default function AddProduct() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: "", description: "", price: null, category: "", stock: 0 })
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function addProduct(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/api/product/add", formData, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then((res) => {
                console.log("response from add product", res)
                alert("Product added")
            })
            .catch((error)=>{
                console.log("error from adding",error)
            })
    }
    return (
        <div className="add-product-container">
        <h2>Add New Product</h2>
        <form className="add-product-form" encType="multipart/form-data">
            <input type="text" name="name" placeholder="Enter Organization name" onChange={handleChange} required />
            <input type="text" name="description" placeholder="Enter Organization description" onChange={handleChange} required />
            <input type="number" name="price" placeholder="Amout required" onChange={handleChange} required />
            <input type="text" name="category" placeholder="Requirement" onChange={handleChange} required />
            <input type="number" name="stock" placeholder="No of items" onChange={handleChange} required />
            <button className="add-product-button" onClick={addProduct}>Add</button>
        </form>
    </div>
    )
}
