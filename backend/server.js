import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { connectDB } from "./library/db.js";
import authRoutes from "./routers/authRoutes.js";
import reviewRouter from "./routers/reviewRouter.js";
import forgetPas from "./routers/forgetPassword.js";
import userInfo from "./routers/friendRoutes.js";
import messageRoutes from "./routers/message.routes.js"
import messageRoute from "./routers/message.routes.js";


import { app,server } from "./library/socket.utils.js";

dotenv.config();



const PORT = process.env.PORT || 5172;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// API Endpoints
app.use("/api/auth", upload.fields([{ name: "profileImage" }, { name: "bannerImage" }]), authRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/forget", forgetPas);
app.use("/api/user", userInfo);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", messageRoute);

// Connect to MongoDB


// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

