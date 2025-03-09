const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const express = require("express");
const router = express.Router();
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, mobile, role } = req.body;
        
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Default role to "user" unless specified as "admin" (only for manually added admins)
        const newUser = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            mobile, 
            role: role || "user" 
        });

        const token = generateToken(newUser._id);
        res.status(201).json({ message: "User created successfully", token, role: newUser.roles });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        console.log("from login ",user)
        res.json({ message: "Login successful", token, role: user.roles });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;