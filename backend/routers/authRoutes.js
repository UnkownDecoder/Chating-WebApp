// authRoutes.js
import express from "express";
import multer from "multer";
import {login , logout , signup } from "../controllers/authController.js"; // Ensure correct path and correct import
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/authController.js"
import { checkAuth } from "../controllers/authController.js"

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Routes
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", ProtectRoute ,updateProfile);
router.get("/check", ProtectRoute , checkAuth);

export default router;
