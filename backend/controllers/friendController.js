import User from '../models/userModel.js';
import { userSocketMap } from "../library/socket.utils.js";


// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, identifier } = req.body;

    console.log("Request Body:", req.body);

    if (!senderId || !identifier) {
      return res.status(400).json({ message: 'Both sender ID and receiver identifier are required!' });
    }

    // Find sender and receiver in the database
    const sender = await User.findOne({ _id: senderId });
    const receiver = await User.findOne({ $or: [{ username: identifier }, { id: identifier }] });

    console.log("receiver:",receiver);
    if (!sender) return res.status(404).json({ message: 'Sender not found!' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found!' });


    // Check if they are already friends
    if (sender.friends.includes(receiver._id)) {
      return res.status(400).json({ message: 'You are already friends!' });
    }

    // Check if a friend request has already been sent
    if (receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: 'Friend request already sent!' });
    }

    // Add sender's ID to receiver's pending friend requests
    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent successfully!' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Respond to Friend Request (Accept or Reject)
export const respondToFriendRequest = async (req, res) => {
  try {


    const { receiverId, senderId, action } = req.body; // action: 'accept' or 'reject'
    console.log("Request Body:", req.body);

    if (!receiverId || !senderId || !action) {
      return res.status(400).json({ message: 'Invalid request parameters!' });
    }

    // Find receiver and sender in database
    const receiver = await User.findOne({ _id: receiverId });
    const sender = await User.findOne({ _id: senderId });

    if (!receiver || !sender) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check if request exists
    if (!receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: 'No pending friend request from this user!' });
    }

    if (action === 'accept') {
      // Ensure `friends` array exists
      receiver.friends.push(sender._id);
      sender.friends.push(receiver._id);
      res.status(200).json({ message: 'Friend request accepted!' });
    } else {
      res.status(200).json({ message: 'Friend request rejected!' });
    }

    // Remove sender from receiver's pending requests
    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());

    // Save updated data
    await receiver.save();
    await sender.save();
  } catch (error) {
    console.error('Error responding to friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Get Pending Friend Requests for a User
export const getPendingFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findOne({ _id: userId }).populate('friendRequests', 'id username');

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ pendingRequests: user.friendRequests });
  } catch (error) {
    console.error('Error fetching pending friend requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getFriendsList = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Find friends using their `id` (not `_id`)
      const friends = await User.find({ _id: { $in: user.friends } })
        .select('id username profileImage');
  
      res.json({ friends });
    } catch (error) {
      res.status(500).json({ message: "Error fetching friends", error });
    }
  };





  

export const getOnlineFriends = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Requested userId:", userId);

        // Find the user's friends
        const user = await User.findById(userId).populate("friends");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userSocketMap) {
            return res.status(500).json({ message: "Online users data is unavailable" });
        }

        // Filter only online friends
        const onlineFriends = user.friends.filter((friend) =>
            userSocketMap.hasOwnProperty(friend._id.toString())
        );

        res.json({ friends: onlineFriends });
    } catch (error) {
        console.error("Error fetching online friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserDetail = async (req, res) => {


    try {
      const user = await User.findOne({ _id: req.params.userId });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

 


