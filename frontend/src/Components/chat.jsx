import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog, FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';
import FriendRequests from './FriendRequests';

const Chat = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showPopup, setShowPopup] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [friendMessages, setFriendMessages] = useState([]);
  const [file, setFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const userId = localStorage.getItem("userId") || '';
  const [user, setUser] = useState({
    username: location.state?.username || "Guest",
    profileImage: location.state?.profileImage || "default-image-url",
  });

  // Initialize socket connection and event listeners
  useEffect(() => {
    const newSocket = io('http://localhost:5172');
    setSocket(newSocket);

    // Register user with their socket ID
    newSocket.emit('register', userId);

    newSocket.on('chat message', (msg) => {
      console.log("Received message:", msg);
      if (msg.to === selectedFriendId || msg.from === selectedFriendId) {
        setFriendMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    newSocket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });

    return () => newSocket.close();
  }, [selectedFriendId, userId]);

  // Fetch user data and friends from the server
  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchFriends();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5172/api/chat/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5172/api/user/friends/${userId}`);
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

// Frontend axios request with credentials
const handleSendMessage = async () => {
  if ((message.trim() || file) && selectedFriendId) {
    const formData = new FormData();
    formData.append('from', userId);
    formData.append('to', selectedFriendId);
    formData.append('content', message);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(`http://localhost:5172/api/chat/send/${selectedFriendId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Ensure credentials are sent with the request
      });

      // Emit the message to the server
      socket.emit('chat message', response.data);

      // Clear the message input field and file
      setMessage('');
      setFile(null);
      adjustTextareaHeight();
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login page)
        window.location.href = "/login"; // or show login modal
      }
    }
  }
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTyping = () => {
    if (selectedFriendId && message.trim()) {
      socket.emit('typing', user.username);
    }
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
  };

  const toggleFriendsView = () => {
    setShowFriends(!showFriends);
    setShowAddFriendMessage(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleFriendClick = (friendId) => {
    setSelectedFriendId(friendId);
    setFriendMessages([]); // Clear previous messages when switching friends
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Left Sidebar - Friends Section */}
      <div style={{ width: `${sidebarWidth}px` }} className="bg-gray-900 text-white p-4 flex flex-col">
        <input
          type="text"
          value={searchQuery}
          onClick={() => setShowPopup(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          placeholder="Find or Start Conversation"
        />
        <button
          className="w-full py-2 mb-4 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={toggleFriendsView}
        >
          Friends
        </button>

        <div className="mt-2">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center p-2 bg-gray-800 rounded-lg mb-2 cursor-pointer"
                onClick={() => handleFriendClick(friend.id)}
              >
                <img
                  src={friend.profileImage || "default-image-url"}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-white">{friend.username}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No friends added yet.</p>
          )}
        </div>

        <div className="mt-auto flex items-center">
          <img src={user.profileImage} alt="User" className="rounded-full w-10 h-10 mr-3" />
          <span className="text-white font-semibold">{user.username}</span>
          <div className="ml-auto flex space-x-4">
            <button className="text-white hover:text-gray-400" onClick={toggleMute}>
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button className="text-white hover:text-gray-400" onClick={toggleDeafen}>
              {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button className="text-white hover:text-gray-400" onClick={handleSettingsClick}>
              <FaCog />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-grow flex flex-col bg-gray-900 text-white border-l-2 border-r-2 border-gray-700">
        {showFriends ? (
          <AddFriends
            showAddFriendMessage={showAddFriendMessage}
            setShowAddFriendMessage={setShowAddFriendMessage}
            friendRequestMessage={friendRequestMessage}
            setFriendRequestMessage={setFriendRequestMessage}
          />
        ) : (
          <div className="flex-grow p-4 overflow-y-auto">
            {selectedFriendId ? (
              <div>
                {friendMessages.length > 0 ? (
                  friendMessages.map((msg, index) => (
                    <div key={index} className="p-2 bg-gray-800 rounded-lg">
                      <p>{msg.content}</p>
                      {msg.fileUrl && (
                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Start a conversation with this friend.</div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">Select a friend to chat with.</div>
            )}
          </div>
        )}

        {typing && <div className="p-2 text-gray-400 italic">{typing}</div>}

        {!showFriends && selectedFriendId && (
          <div className="p-4 bg-gray-800 flex items-center">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-900 text-white"
              placeholder={`Type a message to ${selectedFriendId}`}
              rows={1}
            />
            <label htmlFor="file-upload" className="ml-2 cursor-pointer">
              <FaPaperclip size={24} className="text-white hover:text-gray-400" />
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
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

      <div>
        <div className="flex justify-between p-4 bg-gray-800">
          <span className="text-xl font-semibold">Messages</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
