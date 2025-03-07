// authRoutes.js
import express from "express";
import upload from "../library/multer.js";
import {login , logout , signup } from "../controllers/authController.js"; // Ensure correct path and correct import
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/authController.js"
import { checkAuth } from "../controllers/authController.js"

const router = express.Router();





// Routes
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", ProtectRoute ,updateProfile);
router.get("/check", ProtectRoute , checkAuth);

export default router;
