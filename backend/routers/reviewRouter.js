const express = require("express");
const { getReviews, addReview } = require("../controllers/reviewController");
const router = express.Router();

router.get("/reviews", getReviews); // Fetch all reviews
router.post("/reviews", addReview); // Add a new review

module.exports = router;
