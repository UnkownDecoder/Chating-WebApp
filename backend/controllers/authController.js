import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 

import cloudinary from '../library/cloudinary.js'; 
import { generateToken } from '../library/utils.js';

// Controller function for user registration
        export const signup = async (req, res) => {
  const { username, email, phone, birthdate, bio, password } = req.body;
 
 


  try {
    if (!username || !email || !phone || !password || !birthdate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload files to Cloudinary
    const profileImage = req.files?.profileImage
      ? await cloudinary.uploader.upload(req.files.profileImage[0].path)
      : null;

    const bannerImage = req.files?.bannerImage
      ? await cloudinary.uploader.upload(req.files.bannerImage[0].path)
      : null;

    // Create new user
    const newUser = new User({
      username,
      email,
      phone,
      birthdate,
      bio,
      password: hashedPassword,
      profileImage: profileImage?.secure_url || null,
      bannerImage: bannerImage?.secure_url || null,
    });

    await newUser.save();

    // Generate JWT token
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImage: newUser.profileImage,
      bannerImage: newUser.bannerImage,
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Controller function for user login



export const login = async (req , res) => {
  const { identifier, password } = req.body;

  console.log("hello ",req.body);
  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email, phone number, or password.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid what credientials" });
    }

    generateToken(user._id,res)
   

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage || null,
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
    const userId = req.user._id;

    // Handle file uploads
    const profileImage = req.files?.profileImage
      ? await cloudinary.uploader.upload(req.files.profileImage[0].path)
      : null;

    const bannerImage = req.files?.bannerImage
      ? await cloudinary.uploader.upload(req.files.bannerImage[0].path)
      : null;

    // Update the user with new images
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(profileImage && { profileImage: profileImage.secure_url }),
        ...(bannerImage && { bannerImage: bannerImage.secure_url }),
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile", error });
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