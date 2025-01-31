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
// import FriendReq from "./routers/authUser.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);
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
// app.use("/api/AddFriends", FriendReq);

// Connect to MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle uncaught errors globally
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1); // Exit the process in case of uncaught exception
});

// Graceful shutdown (Optional, for production)
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});