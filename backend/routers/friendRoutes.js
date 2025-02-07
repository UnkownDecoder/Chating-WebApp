import express from 'express';
import { sendFriendRequest, respondToFriendRequest, getPendingFriendRequests, getFriendsList, getOnlineFriends} from '../controllers/friendController.js';

const router = express.Router();

router.post('/AddFriends', sendFriendRequest);
router.post('/respondToFriendRequest', respondToFriendRequest);
router.get('/pendingRequests/:userId', getPendingFriendRequests);
router.get('/friends/:userId', getFriendsList);

router.get("/online-friends/:userId", getOnlineFriends);

  


export default router;