import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000).toString(),  // Generates a random 6-digit number
  },
  username: {
    type: String,
    required: true
  },

  email:  {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  birthdate:{
    type: Date
  },
  bio:{
    type: String
  },
  pronouns:{
    type: String,
    default:null
  },
  password:{ 
      type: String, 
      required: true,
      minlength: 8,
     },
  bannerImage: { 
    type: String,
     default: null 
    },
  profileImage: { 
    type: String,
     default: null
     },
  friends: { 
      type: [mongoose.Schema.Types.ObjectId],
       ref: 'User', default: []
       },

  friendRequests: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User' }], // Store pending requests
}, 
{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
