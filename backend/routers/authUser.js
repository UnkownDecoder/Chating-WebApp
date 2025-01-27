import express from 'express';
import { addFriend } from '../controllers/reqController.js';
const router = express.Router();

router.post("/AddFriends", addFriend);


export default router;