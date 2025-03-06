import express from 'express';
import upload from '../library/multer.js';
import { ProtectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, getUsersForSideBar } from '../controllers/message.controller.js';



const router = express.Router();

// Define routes
router.get("/users",ProtectRoute, getUsersForSideBar);
router.get("/:id",ProtectRoute, getMessages);
router.post("/send/:id", upload.single("file"), ProtectRoute, sendMessage);


export default router;
