const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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