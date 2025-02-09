import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";



const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState('');
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState('');
  const [file, setFile] = useState(null);

  const location = useLocation();
  const textareaRef = useRef(null);

  const userId = localStorage.getItem("userId") || '';
  const [user, setUser] = useState({
    username: location.state?.username || "Guest",
    profileImage: location.state?.profileImage || "default-image-url",
  });

  const { selectedUser, setSelectedUser } = useChatStore();

  const toggleFriendsView = () => {
    setShowFriends((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage((prev) => `${prev} [${selectedFile.name}]`);
    }
  };

  const handleSend = () => {
    if (!message.trim() && !file) return;
    // Send message logic here
    setMessage(""); 
    setFile(null); 
  };

  useEffect(() => {
    const newSocket = io('http://localhost:5172', {
      query: { userId: userId },
    });
    setSocket(newSocket);
    newSocket.emit('register', userId);
    return () => newSocket.close();
  }, [selectedFriendId, userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchFriends();
    } else {
      window.location.href = "/login";
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const response = await axios.get(`http://localhost:5172/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
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

  const handleFriendSelect = (friendId, friendName) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    const selectedFriend = friends.find((friend) => friend._id === friendId);
    if (selectedFriend) {
      setSelectedUser({
        _id: selectedFriend._id,
        username: selectedFriend.username,
        profileImage: selectedFriend.profileImage || "/images/default-profile.png",
      });
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar 
        user={user} 
        friends={friends} 
        onFriendSelect={handleFriendSelect} 
        toggleFriendsView={toggleFriendsView}
      />

      <div className="flex-grow flex flex-col bg-gray-900 text-white border-l-2 border-r-2 border-gray-700">
        {showFriends ? (
          <AddFriends
            showAddFriendMessage={showAddFriendMessage}
            setShowAddFriendMessage={setShowAddFriendMessage}
            friendRequestMessage={friendRequestMessage}
            setFriendRequestMessage={setFriendRequestMessage}
          />
        ) : (
          (!selectedUser ? <NoChatSelected /> : <ChatContainer /> )
        )}
      </div>
    </div>
  );
};

export default Chat;