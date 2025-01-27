import User from '../models/userModel.js'; // Assuming you have a User model

// Function to check if user exists by username or ID
export const addFriend = async (req, res) => {
  try {
    const { senderId, identifier } = req.body;

    console.log("Request Body:", req.body);

    // Validate input
    if (!senderId || !identifier) {
      return res.status(400).json({ message: 'Both sender ID and receiver identifier are required!' });
    }

    // Find sender in the database
    const sender = await User.findOne({ id: senderId });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found!' });
    }

    // Find receiver in the database by username or user ID
    const receiver = await User.findOne({ $or: [{ username: identifier }, { id: identifier }] });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found!' });
    }

    // Ensure the `friends` field is an array
    if (!sender.friends) sender.friends = [];
    if (!receiver.friends) receiver.friends = [];

    // Check if they are already friends
    if (sender.friends.includes(receiver._id)) {
      return res.status(400).json({ message: 'You are already friends!' });
    }

    // Add each other as friends
    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    // Save both users
    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request accepted, and users are now friends!' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
