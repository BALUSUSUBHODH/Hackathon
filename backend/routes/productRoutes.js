const express = require("express");
const Product = require("../models/Product");
const { authMiddleware, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Product (Only Admins)
router.post("/add", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;
        console.log(image)
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            category,
            imageUrl:image,
            createdBy: req.user.id,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get All Products (Anyone Can Access)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get Single Product by ID (Anyone Can Access)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Update Product (Only Admins)
router.put("/:id", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, image },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Delete Product (Only Admins)
router.delete("/:id", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;