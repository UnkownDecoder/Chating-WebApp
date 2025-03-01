import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      text: String,
      image: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);
export default Group;
