import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';

const Chat = ({ userId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState({
    username: location.state?.username || "Guest",
    profileImage: location.state?.profileImage || "default-image-url",
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');

  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);

  const navigate = useNavigate();

  const muteAudio = new Audio('/sounds/mute.mp3');
  const unmuteAudio = new Audio('/sounds/unmute.mp3');

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

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
      adjustTextareaHeight();
    }
  };

  const handleTyping = () => {
    socket.emit('typing', user.username);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    setShowFriends(!showFriends);
    setShowAddFriendMessage(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleFriendRequestSend = () => {
    console.log('Sending friend request:', friendRequestMessage);
    setFriendRequestMessage('');
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Left Sidebar - Friends Section */}
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
          onClick={toggleFriendsView}
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

      {/* Middle Section - Chat Room */}
      <div className="flex-grow flex flex-col bg-gray-900 text-white border-l-2 border-r-2 border-gray-700">
        {showFriends ? (
          <AddFriends
            showAddFriendMessage={showAddFriendMessage}
            setShowAddFriendMessage={setShowAddFriendMessage}
            friendRequestMessage={friendRequestMessage}
            setFriendRequestMessage={setFriendRequestMessage}
            handleFriendRequestSend={handleFriendRequestSend}
          />
        ) : (
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded-lg">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {!showFriends && <div className="p-2 text-gray-400 italic">{typing}</div>}

        {!showFriends && (
          <div className="p-4 bg-gray-800 flex items-center">
            <textarea
              ref={textareaRef}
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

      {/* Right Sidebar - User Profile (conditionally render this section based on showFriends) */}
      {!showFriends && (
        <div className="bg-gray-900 text-white p-4 flex flex-col justify-between w-80">
          <div className="flex items-center mb-4">
            <img
              src={user.profileImage}
              alt="User"
              className="rounded-full w-16 h-16 mr-4"
            />
            <div>
              <span className="text-xl font-semibold">{user.username}</span>
              <button className="mt-2 text-blue-500" onClick={handleSettingsClick}>Edit Profile</button>
            </div>
          </div>

          <button
            className="w-full py-2 mt-auto bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSettingsClick}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
