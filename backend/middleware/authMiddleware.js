const { verifyToken } = require("../config/jwt");
const User = require("../models/User");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    try {
        const verified = verifyToken(token.replace("Bearer ", ""));
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.roles !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { authMiddleware, verifyAdmin };
