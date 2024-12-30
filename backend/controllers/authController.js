const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Adjust the path as needed
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();





// Sign Up
const conn = mongoose.connection;
let gfsBucket;

// Initialize GridFSBucket when MongoDB connection is open
conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Helper function to upload a file to GridFS
const uploadFileToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = gfsBucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });
    uploadStream.end(file.buffer);

    uploadStream.on('finish', () => resolve(uploadStream.id)); // Resolve with the file ID
    uploadStream.on('error', reject);
  });
};

// Controller function for user registration
const signUp = async (req, res) => {
  try {
    const { username, email, phone, birthdate, bio, password } = req.body;
    const files = req.files;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload files to GridFS
    const bannerImage = files.bannerImage ? files.bannerImage[0] : null;
    const profileImage = files.profileImage ? files.profileImage[0] : null;

    const [bannerImageId, profileImageId] = await Promise.all([
      bannerImage ? uploadFileToGridFS(bannerImage) : null,
      profileImage ? uploadFileToGridFS(profileImage) : null,
    ]);

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      birthdate,
      bio,
      password: hashedPassword,
      bannerImage: bannerImageId,
      profileImage: profileImageId,
    });

    const userCreated = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: userCreated });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Sign In
const signIn = async (req, res) => {
    try {
        const { identifier, password } = req.body;
    
        // Validate input
        if (!identifier || !password) {
          return res.status(400).json({ message: 'All fields are required.' });
        }
    
        // Find user by email or phone
        const user = await User.findOne({
          $or: [
            { email: identifier },
            { phone: identifier },
          ],
        });
    
        if (!user) {
          return res.status(400).json({ message: 'Invalid email, phone number, or password.' });
        }
    
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email, phone number, or password.' });
        }
    
        // Simulate generating a token (replace with real JWT in production)
        const token = `fake-jwt-token-for-${user._id}`;
    
        res.status(200).json({
          message: 'Login successful.',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
          },
          token,
        });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
      }
};

module.exports = { signIn, signUp };
