import express from 'express';
import multer from "multer";
import { ProtectRoute } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages, getUsersForSideBar } from '../controllers/message.controller.js';

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Define routes
router.get("/users",ProtectRoute, getUsersForSideBar);
router.get("/:id",ProtectRoute, getMessages);
router.post("/send/:id", upload.single("file"), ProtectRoute, sendMessage);

export default router;
