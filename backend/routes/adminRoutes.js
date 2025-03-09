const express = require("express");
const User = require("../models/User");
const bcrypt=require("bcryptjs")
const router = express.Router();

// ✅ Create Default Admin (Only Runs Once)
router.get("/", async (req, res) => {
    try {
        const adminExists = await User.findOne({ email: "admin@gmail.com" });
        if (adminExists) {
            return res.json({ message: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash("Admin1@", 10);
        const admin = new User({
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            mobile: "8976543211",
            roles: "admin",
        });

        await admin.save();
        res.json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
