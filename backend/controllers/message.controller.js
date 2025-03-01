import User from "../models/userModel.js";
import Message from "../models/message.model.js";

import cloudinary from "../library/cloudinary.js";
import { getReciverSocketId, io } from "../library/socket.utils.js";


export const getUsersForSideBar = async (req, res) => {
    
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne:loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Error getting users for sidebar:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
    };

    export const getMessages = async (req, res) => {
        try {
           const {id:userToChatId}=req.params
           const myId=req.user._id;
         

           const messages=await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
                
            ]
        }) .populate("senderId", "username profileImage") // Populate sender details
        .sort({ createdAt: 1 });
        res.status(200).json(messages);
        } catch (error) {
            console.error('Error getting messages:', error.message);
            res.status(500).json({ message: 'Internal server error' });
    }};


    export const sendMessage = async (req, res) => {
        try {
            const { text } = req.body;
            const { id: receiverId } = req.params; // Extract receiverId (or groupId)
            const senderId = req.user._id;
    
            const isGroup = req.body.isGroup === "true"; // Ensure frontend sends this flag
    
            if (!text && !req.file) {
                return res.status(400).json({ message: "Message content is required (text or image)" });
            }
    
            let imageUrl = null;
            if (req.file) {
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
                imageUrl = uploadResponse.secure_url;
            }
    
            // Create a new message
            const newMessage = new Message({
                senderId,
                text: text || "",
                image: imageUrl || null,
                receiverId: isGroup ? null : receiverId, // Only set receiverId for one-to-one messages
                groupId: isGroup ? receiverId : null, // Only set groupId for group messages
            });
    
            console.log("Saving message:", newMessage);
            await newMessage.save();
    
            // Emit message via socket.io
            const receiverSocketId = isGroup ? null : getReciverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
    
            res.status(201).json({
                _id: newMessage._id,
                senderId: newMessage.senderId,
                text: newMessage.text,
                image: newMessage.image,
                groupId: newMessage.groupId || null, 
                receiverId: newMessage.receiverId || null,
                createdAt: newMessage.createdAt,
            });
    
        } catch (error) {
            console.error("Error sending message:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };