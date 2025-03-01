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
import messageRoutes from "./routers/message.routes.js";
import { app, server } from "./library/socket.utils.js";
import groupRoutes from "./routers/groupRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5172;

// **✅ CORS Middleware**
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Allowed headers
  })
);

app.use(express.json({ limit: "50mb" })); // **JSON size limit increase**
app.use(cookieParser());

// **✅ Handle OPTIONS Preflight Requests**
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.send();
});

// **✅ Body Parser for URL encoded data**
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// **✅ Multer Configuration**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Invalid file type. Only images are allowed."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // **Max file size: 50MB**
});

// **✅ API Routes**
app.use("/api/auth", upload.fields([{ name: "profileImage" }, { name: "bannerImage" }]), authRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/forget", forgetPas);
app.use("/api/user", userInfo);
app.use("/api/groups", groupRoutes);

// **✅ Apply `multer` only to `messageRoutes` where needed**
app.use("/api/messages", messageRoutes);

// **✅ Start Server**
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
