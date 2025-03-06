import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "../library/cloudinary.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { userSocketMap, io } from "../library/socket.utils.js";
import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import upload  from "../library/multer.js";

const router = express.Router();



/* ==============================
   ✅ Create a New Group
============================== */
router.post(
  "/create",
  ProtectRoute,
  upload.single("profileImage"), // Use single upload middleware
  async (req, res) => {
    try {
      let { name, members } = req.body;
      
      // Parse members if needed (assuming it's sent as a JSON string)
      if (typeof members === "string") {
        members = JSON.parse(members);
      }
      
      if (!name || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ message: "Group name and at least one member are required" });
      }

      // Ensure the admin is also a member
      const groupMembers = [...new Set([...members, req.user._id])];

      // Handle profile image upload if file exists
      let profileImageUrl = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profileImageUrl = result.secure_url; // store only the URL
      }

      const newGroup = new Group({
        name,
        members: groupMembers, // should be an array of ObjectId or valid id strings
        admin: req.user._id,
        profileImage: profileImageUrl, // store URL string
      });

      await newGroup.save();
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ message: "Error creating group", error: error.message });
    }
  }
);
/* ==============================
   ✅ Get Groups for a User
============================== */
router.get("/my-groups", ProtectRoute, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "username profileImage");
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error: error.message });
  }
});

/* ==============================
   ✅ Send a Message in a Group
============================== */
router.post("/send/:groupId", ProtectRoute, upload.single("file"), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, messageType } = req.body;
    const senderId = req.user._id;

    // Validate group existence
    const group = await Group.findById(groupId).populate("members", "_id");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Handle media upload (if any)
    let finalMessageType = "text";
    let mediaUrl = null;
    if (req.file) {
                   const uploadResponse = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
                   mediaUrl = uploadResponse.secure_url;
       
                   const fileType = req.file.mimetype.split("/")[0]; // `image`, `video`, `audio`, `application`
                   if (fileType === "image") finalMessageType = "image";
                   else if (fileType === "video") finalMessageType = "video";
                   else if (fileType === "audio") finalMessageType = "audio";
                   else finalMessageType = "document"; // PDF, DOC, etc.
               } else {
                   finalMessageType = messageType || "text";
               }

    // Create and save message in GroupMessage model
    const message = new GroupMessage({
      group: groupId,
      sender: senderId,
      message: text || "",
      messageType: finalMessageType ,
      mediaUrl: mediaUrl || null
    });

    await message.save();
    const responseMessage = await message.populate("sender", "username profileImage");

    // ✅ Emit message to all group members (Real-Time Update)
    group.members.forEach((member) => {
      const receiverSocketId = userSocketMap[member._id];
      if (receiverSocketId && member._id.toString() !== senderId.toString()) {
        io.to(receiverSocketId).emit("newGroupMessage", responseMessage);
      }
    });

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("Error sending group message:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

/* ==============================
   ✅ Fetch Messages for a Group (with Pagination)
============================== */
router.get("/messages/:groupId", ProtectRoute, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    const messages = await GroupMessage.find({ group: groupId })
      .populate("sender", "username profileImage")
      .sort({ createdAt: 1 })  // Newest messages first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});

/* ==============================
   ✅ Get All Groups
============================== */
router.get("/", ProtectRoute, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "username profileImage");
      
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching groups" });
  }
});

export default router;
