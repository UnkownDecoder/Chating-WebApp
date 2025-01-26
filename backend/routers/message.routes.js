const express = require('express');
const router = express.Router();
const { sendMessage , getMessages , getUsersForSideBar } = require('../controllers/message.controller.js');

router.get('/User', getUsersForSideBar);
router.get('/:id',getMessages);
router.post('/send/:id',sendMessage);
module.exports = router;
