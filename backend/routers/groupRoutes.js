import express from "express";
import Group from "../models/group.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
import multer from "multer";
import { ProtectRoute } from "../middleware/auth.middleware.js"; // Middleware to check auth
import { userSocketMap, io } from "../library/socket.utils.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Create a New Group
router.post("/create", ProtectRoute, async (req, res) => {
    try {
      const { name, members } = req.body;
  
      if (!name || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ message: "Group name and at least one member are required" });
      }
  
      // Ensure the admin (req.user._id) is also a member
      const groupMembers = [...new Set([...members, req.user._id])];
  
      const newGroup = new Group({
        name,
        members: groupMembers,
        admin: req.user._id
      });
  
      await newGroup.save();
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ message: "Error creating group", error });
    }
});

// ✅ Get Groups for a User
router.get("/my-groups/:id", ProtectRoute, async (req, res) => {
  try {
    console.log("req.user._id:", req.user._id);
    const groups = await Group.find({ members: req.user._id }).populate("members", "username profileImage");
      
    console.log("groups:", groups);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
});

// ✅ Send a Message in a Group (with Real-Time Update)
router.post("/send/:groupId", ProtectRoute, upload.single('file'), async (req, res) => {
  console.log("Received message data:", req.body);

  try {
      const { groupId } = req.params;
      const { text, isGroup } = req.body;

      // Ensure user is authenticated
      const senderId = req.user._id;
      if (!senderId) {
          return res.status(401).json({ message: "Unauthorized user" });
      }

      // Find the group and populate members
      const group = await Group.findById(groupId).populate("members", "_id");
      if (!group) {
          return res.status(404).json({ message: "Group not found" });
      }

      // Prepare the image URL if a file was uploaded
      let imageUrl = null;
      if (req.file) {
          imageUrl = req.file.path; // Process image accordingly
      }

      // Check for duplicate messages
      const existingMessage = await Message.findOne({
          groupId,
          senderId,
          text: text || "",
      });
      if (existingMessage) {
          return res.status(400).json({ message: "Duplicate message detected." });
      }

      // Create a new message

      const message = new Message({
          senderId,
          groupId,
          receiverId: isGroup ? groupId : req.body.receiverId, // Only set receiverId if not a group message
          text: text || "",
          image: imageUrl || null,
      });

      await message.save();

      // Store only the message ID in the group for scalability
      group.messages.push(message._id);
      await group.save();

      const responseMessage = await message.populate("senderId", "username profileImage"); // Populate sender details
     

      console.log("Sending response message:", responseMessage);

      // ✅ Emit the message to all group members (Real-Time Update)
      console.log("Emitting message to group members:", responseMessage);

      group.members.forEach(member => {
          const receiverSocketId = userSocketMap[member._id];  // Get member's socket
          if (receiverSocketId && member._id.toString() !== senderId.toString()) {  
              io.to(receiverSocketId).emit("newMessage", responseMessage);
              console.log(`Message sent to group member: ${member._id}`);
          }
      });

      

      res.status(201).json(responseMessage);
  } catch (error) {
      console.error("Error sending group message:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.get("/", ProtectRoute, async (req, res) => {
    try {
      const groups = await Group.find({ members: req.user.id }).populate("members", "username profileImage");
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Error fetching groups" });
    }
});

router.get("/messages/:groupId", ProtectRoute, async (req, res) => {
    const { groupId } = req.params;
    console.log("Fetching messages for groupId:", groupId);

    try {
        // Validate if groupId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            console.error("Invalid groupId:", groupId);
            return res.status(400).json({ message: "Invalid groupId" });
        }

        // Find messages related to the groupId
        const messages = await Message.find({ groupId: new mongoose.Types.ObjectId(groupId) })
            .populate("senderId", "username profileImage") // Populate sender details
            .sort({ createdAt: 1 });

        console.log("Messages found:", messages);
        res.json(messages);
    } catch (error) {
        console.error("Error fetching group messages:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
