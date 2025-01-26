import express from 'express';
import { ProtectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, getUsersForSideBar } from '../controllers/message.controller.js';

const router = express.Router();

// Define routes
router.get("/users",ProtectRoute, getUsersForSideBar);
router.get("/:id",ProtectRoute, getMessages);
router.post("/send/:id",ProtectRoute, sendMessage);

export default router;
