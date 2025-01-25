import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import { io } from 'socket.io-client';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io'; // Import the send icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import muteSound from '/sounds/mute.mp3';
import unmuteSound from '/sounds/unmute.mp3';
import userprofile from '/src/assets/images/user.jpg';

const Chat = ({userId}) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState({
    username: location.state?.username || "Guest", // Set username if passed via state
    profileImage: location.state?.profileImage || "default-image-url",// Default image URL before login
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showFriends, setShowFriends] = useState(false);  // Added state to toggle friends view
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);  // State to show message for adding friend

  const [friendRequestMessage, setFriendRequestMessage] = useState(''); // State for friend request message

  const sidebarRef = useRef(null);
  const textareaRef = useRef(null); // Add a ref for the textarea

  const navigate = useNavigate(); // Initialize navigate function

  // Create Audio objects for mute and unmute sounds
  const muteAudio = new Audio(muteSound);
  const unmuteAudio = new Audio(unmuteSound);

  useEffect(() => {
    const newSocket = io('http://localhost:5172');
    setSocket(newSocket);

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);

      if (location.state) {
        setUser({
          username: location.state.username,
          profileImage: location.state.profileImage,
        });
      }
  
    });

    newSocket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user'); // Example endpoint
        const data = await response.json();
        setUser({
          username: data.username,
          photo: data.photo || userprofile, // Use default image if photo is not available
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser({
          username: 'Default User', // Default username
          photo: userprofile, // Default image
        });
      }
    };

    fetchUserProfile();

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
      adjustTextareaHeight(); // Reset the height after sending the message
    }
  };

  const handleTyping = () => {
    socket.emit('typing', user.username);
    adjustTextareaHeight(); // Adjust the height while typing
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on the content
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    !isMuted ? muteAudio.play() : unmuteAudio.play();
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    !isDeafened ? muteAudio.play() : unmuteAudio.play();
  };

  const toggleFriendsView = () => {
    setShowFriends(!showFriends); // Toggle friends view
    setShowAddFriendMessage(false); // Hide the "Add Friend" message when toggling the friends view
  };

  const handleAddFriendClick = () => {
    setShowAddFriendMessage(true); // Show the message below "Add Friend" button when clicked
  };

  const handleFriendRequestSend = () => {
    // Handle sending friend request logic here
    console.log('Sending friend request:', friendRequestMessage);
    setFriendRequestMessage(''); // Clear the message after sending
  };

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to Settings page
  };

  return (
    <div className="flex h-screen bg-black">
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="bg-gray-900 text-white p-4 flex flex-col justify-between"
      >
        <input
          type="text"
          value={searchQuery}
          onClick={() => setShowPopup(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          placeholder="Find or Start Conversation"
          style={{ height: '35px', fontSize: '14px' }}
        />

        <button
          className="w-full py-2 mb-4 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={toggleFriendsView} // Toggle friends view on button click
          style={{ transition: 'background-color 0.3s ease' }}
        >
          Friends
        </button>

        <div className="mt-auto flex items-center mb-4">
          <img
           src={user.profileImage}
            alt="User"
            className="rounded-full w-10 h-10 mr-3"
          />
          <span className="text-white font-semibold">{user.username}</span>
          <div className="ml-auto flex space-x-4">
            <div className="relative group">
              <button className="text-white hover:text-gray-400" onClick={toggleMute}>
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-gray-400" onClick={toggleDeafen}>
                {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-gray-400" onClick={handleSettingsClick}>
                <FaCog />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-grow flex flex-col bg-gray-900 text-white">
        {/* Friends Navbar (moved to top) */}
        {showFriends && (
          <div className="flex justify-start items-center p-4 bg-gray-800 space-x-4">
            <span className="font-semibold text-xl mr-4">Friends</span>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Online</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">All</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Pending</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Blocked</button>
            <button
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              onClick={handleAddFriendClick} // Handle Add Friend click
            >
              Add Friend
            </button>
          </div>
        )}

        {/* Add Friend Message and Friend Request Input */}
        {showAddFriendMessage && (
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2">Add Friend</h2>
            <p className="text-sm text-gray-400 mb-4">You can add friends with their username or their unique ID number</p>
            <textarea
              value={friendRequestMessage}
              onChange={(e) => setFriendRequestMessage(e.target.value)}
              placeholder="You can add friends with their username or their unique ID number"
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-800 text-white mb-2"
              rows={1}
            />
            <button
              onClick={handleFriendRequestSend}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Send Friend Request
            </button>
          </div>
        )}

        {/* Chat Room or Friends View Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          {!showFriends ? (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded-lg">
                  {msg}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Additional friends content goes here */}
            </div>
          )}
        </div>

        {/* Typing Indicator */}
        {!showFriends && <div className="p-2 text-gray-400 italic">{typing}</div>}

        {/* Message Input */}
        {!showFriends && (
          <div className="p-4 bg-gray-800 flex items-center">
            <textarea
              ref={textareaRef} // Add the ref to the textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-900 text-white"
              placeholder="Type a message"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-purple-600"
            >
              <IoMdSend size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;