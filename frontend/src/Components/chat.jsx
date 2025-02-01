import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import AddFriends from "./AddFriends";
import Sidebar from "./Sidebar";
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";
import { useChatStore } from "../store/useChatStore";




const Chat = ({ userId }) => {
  const { selectedUser } = useChatStore();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const muteAudio = new Audio('/sounds/mute.mp3');
  const unmuteAudio = new Audio('/sounds/unmute.mp3');

  useEffect(() => {
    const newSocket = io('http://localhost:5172');
    setSocket(newSocket);

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
      {/* Left Sidebar */}
      <Sidebar />

      {/* Middle Section - Chat Room */}
      <div className="flex-1 overflow-hidden">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>

      {/* Right Sidebar - User Profile */}
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
