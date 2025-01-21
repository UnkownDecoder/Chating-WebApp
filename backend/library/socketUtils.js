// Example utility function to send private messages
const sendPrivateMessage = (io, toSocketId, msg) => {
    io.to(toSocketId).emit('private message', msg);
  };
  
  module.exports = {
    sendPrivateMessage,
  };
  