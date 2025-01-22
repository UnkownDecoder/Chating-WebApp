const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Adjust the path as needed
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

router.get('/chat/:id', async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });

      if (user) {
        res.json({
          username: user.username,
          photo: user.photo,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
 module.exports = router;
