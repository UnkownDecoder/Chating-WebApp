const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/userModel'); 
require('dotenv').config();


// Email configuration using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for security
    pass: process.env.EMAIL_PASS,
  },
});

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/forgot-password', async (req, res) => {
  const { identifier } = req.body; // Can be email or phone

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.tokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    const resetLink = `http://localhost:5172/api/forget/reset-password?token=${resetToken}`;

    if (user.email === identifier) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        text: `Click the link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Password reset link sent to your email.' });
      });
    } else if (user.phone === identifier) {
      twilioClient.messages
        .create({
          body: `Click the link to reset your password: ${resetLink}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone,
        })
        .then((message) => {
          console.log('SMS sent:', message.sid);
          res.json({ message: 'Password reset link sent to your phone.' });
        })
        .catch((error) => {
          console.error('Error sending SMS:', error);
          res.status(500).json({ message: 'Error sending SMS' });
        });
    } else {
      res.status(400).json({ message: 'Invalid identifier' });
    }
  } catch (error) {
    console.error('Error processing password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, tokenExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.tokenExpires = null;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error processing password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
