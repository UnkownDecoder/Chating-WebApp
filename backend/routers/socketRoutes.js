import socketController from '../controllers/socketController.js';

export default function(io) {
  // Handle socket connection
  io.on('connection', (socket) => {
    console.log('New client connected');

    // When a new message is sent
    socket.on('chat message', (msg) => {
      // Passing the socket and message to the socketController function
      socketController.handleMessage(io, socket, msg);
    });

    // When a user starts typing
    socket.on('typing', (username) => {
      // Passing the socket and username to handle typing event
      socketController.handleTyping(io, socket, username);
    });

    // Send initial friends list (assuming you have a method for that)
    socket.emit('update friends', socketController.getFriendsList());

    // When the user disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected');
      socketController.handleDisconnect(socket); // Optional, if you want to handle disconnection logic
    });
  });
}
