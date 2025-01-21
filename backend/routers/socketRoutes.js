const socketController = require('../controllers/socketController');

module.exports = function(io) {
  // Handle socket connection
  io.on('connection', (socket) => {
    console.log('New client connected');

    // When a new message is sent
    socket.on('chat message', (msg) => {
      socketController.handleMessage(io, socket, msg);
    });

    // When a user starts typing
    socket.on('typing', (username) => {
      socketController.handleTyping(io, socket, username);
    });

    // Send initial friends list
    socket.emit('update friends', socketController.getFriendsList());

    // When the user disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
