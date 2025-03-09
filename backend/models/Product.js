const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String }, // Optional: Store image URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who added product
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);