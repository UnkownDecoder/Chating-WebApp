import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null }, // ✅ Make it optional
  text: { type: String, required: false },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
