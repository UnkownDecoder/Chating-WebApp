import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Store online users
const userSocketMap = {};

// Function to get a receiver's socket ID
export function getReciverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;  // Always update socket ID when user connects
    console.log(`User registered: ${userId} -> ${socket.id}`);
  } else {
    console.log("User ID is missing, unable to map socket to user.");
  }

  // Emit updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle message sending
  socket.on("sendMessage", (messageData) => {
    console.log("Message received from client:", messageData);

    const receiverSocketId = userSocketMap[messageData.receiverId];

    // Send message to receiver if they are online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
      console.log(`Message sent to receiver: ${messageData.receiverId}`);
    }

    // Also send the message back to the sender
    io.to(socket.id).emit("newMessage", messageData);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId]; // Remove user from online list
      console.log(`User ${userId} removed from online list.`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server,userSocketMap };
