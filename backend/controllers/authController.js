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


    const uniqueName = await User.findOne({ username });
    if (uniqueName) {
      return res.status(400).json({ message: 'this name is already registerd' });
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
      pronouns: newUser.pronouns,
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
    console.log("user",user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email, phone number, or password.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid ID or PAASSWORD" });
    }

  

    const token =  generateToken(user._id,res)
   

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage || null,
      phone: user.phone,
      bannerImage: user.bannerImage || null,
      token: token,
      bio: user.bio,
      pronouns: user.pronouns,
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
  console.log("update profile",req.body);
  console.log("update profile",req.files);
  try {
    const userId = req.user._id;
    const { username, bio, pronouns } = req.body;

    // Get current user to check for existing images
    const currentUser = await User.findById(userId);
    
    // Handle file uploads
    let profileImageUrl, bannerImageUrl;
    
    if (req.files?.profileImage) {
      // Delete old profile image if exists
      if (currentUser.profileImage) {
        const publicId = currentUser.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadResult = await cloudinary.uploader.upload(req.files.profileImage[0].path);
      profileImageUrl = uploadResult.secure_url;
    }

    if (req.files?.bannerImage) {
      // Delete old banner image if exists
      if (currentUser.bannerImage) {
        const publicId = currentUser.bannerImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadResult = await cloudinary.uploader.upload(req.files.bannerImage[0].path);
      bannerImageUrl = uploadResult.secure_url;
    }

    // Update user data
    const updateData = {
      ...(username && { username }),
      ...(bio && { bio }),
      ...(pronouns && { pronouns }),
      ...(profileImageUrl && { profileImage: profileImageUrl }),
      ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update profile",
      error: error.message 
    });
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


export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both old and new passwords are required.' });
    }

    // Fetch the user
    const user = await User.findById(userId).select('+password'); // assuming password is select: false in schema

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
