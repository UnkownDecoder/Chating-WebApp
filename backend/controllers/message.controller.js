import User from "../models/userModel.js";
import Message from "../models/message.model.js";

import cloudinary from "../library/cloudinary.js";
import { getReceiverSocketId, io } from "../library/socket.utils.js";


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
            const { text, messageType } = req.body;
            const { id: receiverId } = req.params; // One-to-one chat ke liye receiverId
            const senderId = req.user._id;
    
            if (!text && !req.file) {
                return res.status(400).json({ message: "Message content is required (text or media)" });
            }
    
            let mediaUrl = null;
            let finalMessageType = "text";
    
            // Agar file aayi hai toh uska type check karo
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
    
            // Naya message create karo
            const newMessage = new Message({
                senderId,
                receiverId, // One-to-one chat
                messageType: finalMessageType,
                text: text || "",
                mediaUrl: mediaUrl || null,
            });
    
            console.log("Saving message:", newMessage);
            await newMessage.save();
    
            // Populate sender details
            const responseMessage = await newMessage.populate("senderId", "username profileImage");
    
            // Socket.io Emit Message to receiver only
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", responseMessage);
            }
    
            res.status(201).json(responseMessage);
    
        } catch (error) {
            console.error("Error sending message:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };