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
const userSocketMap = {}; // { userId: socketId }
const groupMembersMap = {}; // { groupId: [userIds] }

// Function to get a receiver's socket ID
export function getReciverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id; // Always update socket ID when user connects
    console.log(`User registered: ${userId} -> ${socket.id}`);
  } else {
    console.log("User ID is missing, unable to map socket to user.");
  }

  // Emit updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // User joins a group chat
  socket.on("joinGroup", ({ groupId, userId }) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group: ${groupId}`);

    if (!groupMembersMap[groupId]) {
      groupMembersMap[groupId] = [];
    }
    if (!groupMembersMap[groupId].includes(userId)) {
      groupMembersMap[groupId].push(userId);
    }

    io.to(groupId).emit("groupUsers", groupMembersMap[groupId]);
  });

  // User leaves a group chat
  socket.on("leaveGroup", ({ groupId, userId }) => {
    socket.leave(groupId);
    console.log(`User ${userId} left group: ${groupId}`);

    if (groupMembersMap[groupId]) {
      groupMembersMap[groupId] = groupMembersMap[groupId].filter((id) => id !== userId);
      io.to(groupId).emit("groupUsers", groupMembersMap[groupId]);
    }
  });

  // Handle message sending (Supports both 1-to-1 & Group Chat)
  socket.on("sendMessage", (messageData) => {
    console.log("Message received from client:", messageData);

    const { receiverId, groupId } = messageData;

    if (groupId) {
      // ✅ Send message to all members in the group
      io.to(groupId).emit("newMessage", messageData);
      console.log(`Group message sent to group ${groupId}`);
    } else if (receiverId) {
      // ✅ Send message only to a single recipient
      const receiverSocketId = userSocketMap[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
        console.log(`Message sent to receiver: ${receiverId}`);
      }
    }

    // Send the message back to the sender as well
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

export { io, app, server, userSocketMap };
