let friendsList = ['John', 'Alice', 'Bob', 'Eve']; // Example friends list

// Controller to handle chat messages
const handleMessage = (io, socket, msg) => {
  console.log(`Message received: ${msg}`);
  io.emit('chat message', msg); // Broadcast the message to all clients
};

// Controller to handle typing events
const handleTyping = (io, socket, username) => {
  socket.broadcast.emit('typing', username); // Broadcast to other users that someone is typing
};

// Function to get the current friends list
const getFriendsList = () => {
  return friendsList;
};

// Export the functions
module.exports = {
  handleMessage,
  handleTyping,
  getFriendsList,
};
