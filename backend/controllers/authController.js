// authController.js
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 

import cloudinary from '../library/cloudinary.js'; 
import { generateToken } from '../library/utils.js';

// Controller function for user registration
export const signup = async (req , res) => {
  const { username, email, phone, birthdate, bio, password , profileImage , bannerImage } = req.body;
 try {
  if (!username || !email || !phone || !password || !birthdate) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    phone,
    birthdate,
    bio,
    password: hashedPassword,
    profileImage: profileImage || null,
    bannerImage: bannerImage || null,
  });

  if(newUser) {
    // generate jwt token
    generateToken(newUser._id, res);
    await newUser.save();
    res.status(201).json({ 
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImage: newUser.profileImage,
      bannerImage: newUser.bannerImage,
     });
  }else {
    res.status(400).json({ message: "invalid user data" });
  }
 } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Error registering user", error });
 }
};

// Controller function for user login

export const login = async (req , res) => {
  const { email , password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credientials" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid credientials" });
    }

    generateToken(user._id,res)

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    })
    


  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};



// Controller function for user logout
export const logout =  (req , res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log("Error logging out user:", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};



// Controller function for user profile photo & banner update
export const updateProfile = async (req, res) => {
  try {
    const { profileImage, bannerImage } = req.body;
    const userId = req.user._id;

    if (!profileImage && !bannerImage) {
      return res.status(400).json({ message: "profile pics are required" });
    }

  const uploadResponse = await cloudinary.uploader.upload(profileImage && bannerImage);
  const updatedUser = await User.findByIdAndUpdate(userId, {
    profileImage: uploadResponse.secure_url,
    bannerImage: uploadResponse.secure_url
  }, { new: true });

  res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
    
  }
};



// Controller function for checking if user exists by username or ID
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error checking user:', error.message);
    res.status(500).json({ message: 'Internal server error' });

  }
};