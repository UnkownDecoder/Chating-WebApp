import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [friendsList, setFriendsList] = useState([]); // Dynamic friends list
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default width of sidebar (in pixels)
  const minSidebarWidth = 200; // Minimum sidebar width
  const maxSidebarWidth = 400; // Maximum sidebar width

  const sidebarRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Your backend server URL
    setSocket(newSocket);

    // Listen for chat messages
    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for typing indicator
    newSocket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });

    // Listen for updated friends list
    newSocket.on('update friends', (friends) => {
      setFriendsList(friends); // Update the friends list in real-time
    });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message); // Send message to server
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', 'User'); // Emit typing event
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      let newWidth = startWidth + diff;
      // Restrict the sidebar width between min and max
      if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
      if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;

      setSidebarWidth(newWidth); // Update the width of the sidebar
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Send message on Enter (without Shift)
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Left Sidebar (Friend List) */}
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="bg-gray-800 text-white p-4"
      >
        <h2 className="text-xl font-semibold mb-4">Friends</h2>
        <ul className="space-y-2">
          {friendsList.map((friend, index) => (
            <li key={index} className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
              {friend}
            </li>
          ))}
        </ul>
      </div>

      {/* Divider for resizing */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-ew-resize bg-gray-600 w-1"
      />

      {/* Right Chatting Section */}
      <div className="flex-grow flex flex-col bg-white">

        {/* Chat Header */}
        <header className="bg-blue-600 text-white p-4 text-center text-xl">
          Chat Room
        </header>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-gray-200 rounded-lg">
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="p-2 text-gray-500 italic">
          {typing}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-200 flex items-center">
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyPress}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type a message"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-600 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
};

export default Chat;






