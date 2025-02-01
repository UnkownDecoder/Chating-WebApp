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
            const { text,image } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;

            let imageUrl;
            if (image) {
                // Upload image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
            });
            await newMessage.save();

            // real-time functionality goes here => socket.io
            const receiverSocketId = getReciverSocketId(receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error sending message:', error.message);
            res.status(500).json({ message: 'Internal server error' });
            
        }
    };
        