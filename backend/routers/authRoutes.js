const express = require('express');
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is installed
const User = require('../models/userModel'); 
const multer = require('multer');

const authController = require("../controllers/authController");
const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/register', upload.fields([{ name: 'bannerImage' }, { name: 'profileImage' }]),authController.signUp);

router.route('/login').post(authController.signIn);





module.exports = router;