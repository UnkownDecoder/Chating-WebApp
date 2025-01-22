const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000).toString(),  // Generates a random 6-digit number
  },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  birthdate: { type: Date },
  bio: { type: String },
  password: { type: String, required: true },
  bannerImage: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  profileImage: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;