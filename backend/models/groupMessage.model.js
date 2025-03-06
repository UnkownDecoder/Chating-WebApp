import mongoose from 'mongoose';

const groupMessageSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: function() { return this.messageType === "text"; }
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'document', 'audio'],
    default: 'text'
  },
  mediaUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
export default GroupMessage;
