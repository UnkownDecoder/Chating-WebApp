import express from 'express';
import { getReviews, addReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/reviews', getReviews); // Fetch all reviews
router.post('/reviews', addReview); // Add a new review

export default router;
