import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default width of sidebar (in pixels)
  const [showPopup, setShowPopup] = useState(false); // State for popup modal
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
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

      {/* Left Sidebar (Search Bar for Friends) */}
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="bg-gray-800 text-white p-4"
      >
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onClick={() => setShowPopup(true)} // Open popup modal on click
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Find or Start Conversation"
          readOnly // Prevent typing into the search input
        />

        {/* Friends Button */}
        <button
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => console.log('Friends button clicked!')}
        >
          Friends
        </button>
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Start a Conversation</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username or ID"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPopup(false)} // Close modal
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => { console.log(`Searching for: ${searchQuery}`); setShowPopup(false); }}
                className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;



