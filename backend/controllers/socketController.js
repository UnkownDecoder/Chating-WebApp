// // socketController.js

// // Simulating friends list data
// let friendsList = [
//   { id: 1, name: 'User1' },
//   { id: 2, name: 'User2' },
//   { id: 3, name: 'User3' },
// ];

// // Handle incoming chat message
// exports.handleMessage = (io, socket, msg) => {
//   console.log('Received message:', msg);
  
//   // Broadcast message to all connected users (You can customize this logic)
//   io.emit('chat message', msg);
// };

// // Handle typing event
// exports.handleTyping = (io, socket, username) => {
//   console.log(`${username} is typing...`);
  
//   // Broadcast typing event to other users (except the sender)
//   socket.broadcast.emit('typing', username);
// };

// // Get the friends list
// exports.getFriendsList = () => {
//   // Here, you can replace this with actual DB query or other logic to fetch friends
//   return friendsList;
// };

// // Handle user disconnection (Optional)
// exports.handleDisconnect = (socket) => {
//   console.log('User disconnected');
//   // Here you can handle any necessary cleanup or user-specific logic
// };

