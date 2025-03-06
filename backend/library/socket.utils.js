// Backend: socket.js
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

// Store online users & group members
const userSocketMap = {}; // { userId: socketId }
const groupMembersMap = {}; // { groupId: [userIds] }

export function getReciverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User registered: ${userId} -> ${socket.id}`);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle joining a group
  socket.on("joinGroup", ({ groupId, userId }) => {
    if (!groupId || !userId) return;
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

  // Handle adding a new member to a group
  socket.on("addGroupMember", ({ groupId, newMemberId }) => {
    if (!groupId || !newMemberId) return;
    if (!groupMembersMap[groupId].includes(newMemberId)) {
      groupMembersMap[groupId].push(newMemberId);
      io.to(groupId).emit("groupUsers", groupMembersMap[groupId]);
    }
  });

  // Handle leaving a group
  socket.on("leaveGroup", ({ groupId, userId }) => {
    if (!groupId || !userId) return;
    socket.leave(groupId);
    console.log(`User ${userId} left group: ${groupId}`);
    
    if (groupMembersMap[groupId]) {
      groupMembersMap[groupId] = groupMembersMap[groupId].filter((id) => id !== userId);
      io.to(groupId).emit("groupUsers", groupMembersMap[groupId]);
    }
  });

  // Handle sending messages (1-to-1 and group chat)
  socket.on("sendMessage", (messageData) => {
    if (!messageData) return;
    const { receiverId, groupId, senderId } = messageData;
    
    if (groupId) {
      io.to(groupId).emit("newGroupMessage", messageData);
      io.to(socket.id).emit("messageDelivered", { groupId, senderId });
    } else if (receiverId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
      }
    }
    io.to(socket.id).emit("newMessage", messageData);
  });

  // Handle message read status
  socket.on("readGroupMessage", ({ groupId, userId }) => {
    io.to(groupId).emit("messageRead", { groupId, userId });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});



export { io, app, server, userSocketMap };
