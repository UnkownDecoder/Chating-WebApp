import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';

const Chat = (userId) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState({
    username: '', // Default value before login
    photo: '', // Default image URL before login
  });

  // Mute and Deafen states
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const minSidebarWidth = 200;
  const maxSidebarWidth = 400;
  const sidebarRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5172');
    setSocket(newSocket);

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });

    // Fetch the user profile from your backend after login
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5172/api/user/chat/${userId}`); 
        const data = await response.json();
        setUser({
          username: data.username,
          photo: data.photo,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();

    return () => newSocket.close();
  }, [userId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', user.username);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      let newWidth = startWidth + diff;
      if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
      if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;

      setSidebarWidth(newWidth);
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
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="bg-gray-800 text-white p-4 flex flex-col justify-between"
      >
        <input
          type="text"
          value={searchQuery}
          onClick={() => setShowPopup(true)}
          onChange={handleSearchChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Find or Start Conversation"
          style={{ height: '35px', fontSize: '14px' }}
        />

        <button
          className="w-full py-2 mb-4 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => console.log('Friends button clicked!')}
          style={{ transition: 'background-color 0.3s ease' }}
        >
          Friends
        </button>

        <div className="mt-auto flex items-center mb-4">
          <img
            src={user.photo}
            alt="User"
            className="rounded-full w-10 h-10 mr-3"
          />
          <span className="text-white font-semibold">{user.username}</span>
          <div className="ml-auto flex space-x-4">
            <div className="relative group">
              <button className="text-white hover:text-gray-400" onClick={toggleMute}>
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-8 text-xs text-white opacity-0 group-hover:opacity-100">
                {isMuted ? 'Unmute Yourself' : 'Mute Yourself'}
              </span>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-gray-400" onClick={toggleDeafen}>
                {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-8 text-xs text-white opacity-0 group-hover:opacity-100">
                {isDeafened ? 'Undeafen Yourself' : 'Deafen Yourself'}
              </span>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-gray-400">
                <FaCog />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-8 text-xs text-white opacity-0 group-hover:opacity-100">
                User Settings
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="cursor-ew-resize bg-gray-600 w-1"
      />

      <div className="flex-grow flex flex-col bg-white">
        <header className="bg-blue-600 text-white p-4 text-center text-xl">
          Chat Room
        </header>

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-gray-200 rounded-lg">
                {msg}
              </div>
            ))}
          </div>
        </div>

        <div className="p-2 text-gray-500 italic">
          {typing}
        </div>

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
                onClick={() => setShowPopup(false)}
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
