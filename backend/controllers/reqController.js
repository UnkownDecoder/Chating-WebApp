// In your backend (e.g., userController.js)
const User = require('../models/userModel'); // Assuming you have a User model

// Function to check if user exists by username or ID
async function checkUserExistence(req, res) {
  const { identifier } = req.body; // username or user ID

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { id: identifier }], // Look up by 'username' or 'id'
    });

    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { checkUserExistence };
