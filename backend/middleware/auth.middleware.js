import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const ProtectRoute = async (req, res, next) => {
    try {
        let token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

        console.log("Token Received:", token); // Debugging purpose (Remove in production)

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};
