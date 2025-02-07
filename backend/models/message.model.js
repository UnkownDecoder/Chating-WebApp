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
    text: {
      type: String,
      required: function () {
        return !this.image; // Make text required only if there's no image
      }
    },
    image: {
      type: String, // Store Cloudinary URL instead of ObjectId
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
