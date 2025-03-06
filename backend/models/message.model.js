import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "document", "audio"],
    default: "text"
  },
  text: { 
    type: String, 
    required: function() { return this.messageType === "text"; } 
  },
  mediaUrl: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Message", messageSchema);
