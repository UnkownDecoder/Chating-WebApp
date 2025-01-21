const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  online: { type: Boolean, default: false },
  // Other user fields like password, email, etc.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
