import mongoose from "mongoose";  // Using ES6 import for mongoose

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
});

export default mongoose.model("Review", reviewSchema);  // Using export default for the model
