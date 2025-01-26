const express = require('express');
const User = require('../models/userModel'); // Import User model

const router = express.Router();

// Add friend API endpoint
router.post('/AddFriends', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Validate input
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Both sender and receiver IDs are required!' });
    }

    // Find sender and receiver in the database
    const sender = await User.findOne({ id: senderId });
    const receiver = await User.findOne({ id: receiverId });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found!' });
    }

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
});

module.exports = router;
