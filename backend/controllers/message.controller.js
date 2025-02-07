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
        })
        res.status(200).json(messages);
        } catch (error) {
            console.error('Error getting messages:', error.message);
            res.status(500).json({ message: 'Internal server error' });
    }};


    export const sendMessage = async (req, res) => {
        try {
           

    
            const { text } = req.body; // Extract text from req.body
            const { id: receiverId } = req.params; // Extract receiverId from params
            const senderId = req.user._id; // Extract senderId from req.user
    
            // Ensure at least text or an image is provided
            if (!text && !req.file) {
                return res.status(400).json({ message: "Message content is required (text or image)" });
            }
            
    
            let imageUrl = null;
            if (req.file) {
                // Upload image to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "auto",
                  });
                  
                imageUrl = uploadResponse.secure_url;
            }
    
            // Create and save message
            const newMessage = new Message({
                senderId,
                receiverId,
                text: text || "", // Default to empty string if no text
                image: imageUrl,
            });
    
            console.log("Saving message:", newMessage);
            await newMessage.save();
    
            // Emit message via socket.io
            const receiverSocketId = getReciverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
    
            res.status(201).json(newMessage);
        } catch (error) {
            console.error("Error sending message:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    