
import User from '../models/userModel.js'; 
import Group from '../models/group.model.js';
import GroupMessage from '../models/groupMessage.model.js';
import Message from '../models/message.model.js';
export const getAllUsers = async (req, res) => {
    try{
       const users = await User.find();
       if(!users || users.length === 0){
        return res.status(404).json({message:"no user found"});
       }
       return res.status(200).json(users);
    } catch(error){
        next(error);
    }
};

export const getAllGroups = async (req, res) => {
    try{
       const groups = await Group.find();
       if(!groups || groups.length === 0){
        return res.status(404).json({message:"no group found"});
       }
       return res.status(200).json(groups);
    } catch(error){
        next(error);
    }
};

export const getAllMessages = async (req, res) => {
    try{
       const messages = await Message.find();
       if(!messages || messages.length === 0){
        return res.status(404).json({message:"no messages found"});
       }
       return res.status(200).json(messages);
    } catch(error){
        next(error);
    }
};

export const getAllGroupsMessages = async (req, res) => {
    try{
       const groupMessages = await GroupMessage.find();
       if(!groupMessages || groupMessages.length === 0){
        return res.status(404).json({message:"no group messages found"});
       }
       return res.status(200).json(groupMessages);
    } catch(error){
        next(error);
    }
};

