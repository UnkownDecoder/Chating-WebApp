const mongoose = require('mongoose');

// Define the schema for FriendRequest
const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to User model (assuming you have a User model)
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to User model
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
