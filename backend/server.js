import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoutes.js";
import { connectDB } from "./library/db.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import messageRoutes from "./routers/message.routes.js";


import cors from "cors";
import bodyParser from "body-parser";

import gridfs from "gridfs-stream";
import multer from "multer";
import forgetPas from './routers/forgetPassword.js';
import reviewRouter from './routers/reviewRouter.js';
import userInfo from './routers/authUser.js';

import FriendReq from './routers/authUser.js';
import http from 'http';
import { Server } from 'socket.io'; // Import socket.io


dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5172;
const corsOptions = {
  origin: "http://localhost:5173/",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true
};

// Middleware setup for parsing JSON requests before routing
app.use(express.json()); // Important to parse JSON request bodies
app.use(cookieParser()); // To parse cookies in requests
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true })); // Optional, if you're handling URL-encoded data as well

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRouter);
app.use('/api/forget', forgetPas);
app.use('/api/user', userInfo);
app.use('/api/AddFriends', FriendReq);
app.use('/api/message', messageRoutes);

// Connect to DB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Frontend origin
    credentials: true,  // Enable credentials for cross-origin requests
  },
}); 
// GridFS setup
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = gridfs(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoint to upload images
app.post('/upload', upload.fields([{ name: 'bannerImage' }, { name: 'profileImage' }]), (req, res) => {
  const files = req.files;
  const bannerImage = files.bannerImage ? files.bannerImage[0] : null;
  const profileImage = files.profileImage ? files.profileImage[0] : null;

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const writeStream = gfs.createWriteStream({
        filename: file.originalname,
        content_type: file.mimetype
      });
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', () => resolve(writeStream.id));
      writeStream.on('error', reject);
    });
  };

  Promise.all([bannerImage ? uploadImage(bannerImage) : null, profileImage ? uploadImage(profileImage) : null])
    .then(([bannerImageId, profileImageId]) => {
      res.json({ bannerImageId, profileImageId });
    })
    .catch(err => {
      console.error('Error uploading images:', err);
      res.status(500).json({ message: 'Error uploading images' });
    });
});

// Default route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Socket.IO setup for real-time chat
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Listen for incoming messages from clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Listen for user typing events (optional)
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username); // Notify others when someone is typing
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
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
