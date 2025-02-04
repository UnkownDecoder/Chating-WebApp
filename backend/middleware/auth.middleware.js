import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const ProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ message: "unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ message: "unauthorized - token verification failed" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error authenticating user:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
};