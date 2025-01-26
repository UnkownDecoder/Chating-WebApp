import mongoose from 'mongoose';

// Define the schema for Message
const messageSchema = new mongoose.Schema(
    {
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files'
  },
},
  { timestamps: true }
);
const Message = mongoose.model('Message', messageSchema);
export default Message;