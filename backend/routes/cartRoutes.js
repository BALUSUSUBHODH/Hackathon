const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Product to Cart (Only Users)
router.post("/add", authMiddleware, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).json({ message: "Admins cannot add products to cart" });
        }

        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            const existingProduct = cart.products.find(p => p.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ productId });
            }
        } else {
            cart = new Cart({ userId: req.user.id, products: [{ productId }] });
        }

        await cart.save();
        res.json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Get User's Cart
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");
        if (!cart) return res.status(200).json({ products: [] });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(p => p.productId.toString() !== req.params.productId);
        await cart.save();

        // Populate product details after saving the updated cart
        cart = await Cart.findOne({ userId: req.user.id }).populate("products.productId");

        res.json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
