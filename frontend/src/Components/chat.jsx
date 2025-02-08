import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';
import Sidebar from './Sidebar';
import ChatContainer from "./ChatContainer";
import { useChatStore } from "../store/useChatStore"; // Import Zustand store

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState('');
  const [selectedFriendProfile, setSelectedFriendProfile] = useState('');
  const [friendMessages, setFriendMessages] = useState([]);
  const [file, setFile] = useState(null);

  const location = useLocation();
  const textareaRef = useRef(null);

  const userId = localStorage.getItem("userId") || '';
  const [user, setUser] = useState({
    username: location.state?.username || "Guest",
    profileImage: location.state?.profileImage || "default-image-url",
  });




  
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
    if (!message.trim() && !file) return; // Prevent empty messages
    handleSendMessage({ text: message, file });
    setMessage(""); 
    setFile(null); 
  };




  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5172', { query: { userId } });
      socketRef.current.emit('register', userId);
    }
  
    const socket = socketRef.current;
  
    socket.on('newMessage', (msg) => {
      if (msg.receiverId === selectedFriendId || msg.senderId === selectedFriendId) {
        setFriendMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
  
    socket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });
  
    return () => {
      socket.off('newMessage');
      socket.off('typing');
    };
  }, [selectedFriendId, userId]);
  
  useEffect(() => {
    if (userId) {
      console.log("User ID exists, fetching data:", userId);
      fetchUserData();
      fetchFriends();
    } else {
      console.error("User ID not found, redirecting to login...");
      window.location.href = "/login";
    }
  }, [userId]);
  

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
    
      if (!token) throw new Error("No token found");
  
      const response = await axios.get(`http://localhost:5172/api/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token with request
        },
      });
  
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = "/login";
      }
    }
  };
  

  const fetchFriends = async () => {
  try {
    const response = await axios.get(`http://localhost:5172/api/user/friends/${userId}`);
    setFriends(response.data.friends);
    console.log("friends:",response.data.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};

const handleSendMessage = async () => {
  if (!message.trim() && !file) return;

  if ((message.trim() || file) && selectedFriendId) {
    const formData = new FormData();
    formData.append('text', message);
    if (file) formData.append('file', file);

    useChatStore.getState().sendMessage({
      text: message,
      image: file,
    });

    // **Clear input fields after sending**
    setMessage('');
    setFile(null);
  }
};




const handleFriendSelect = (friendId, friendName, friendProfile) => {
  setSelectedFriendId(friendId);
  setSelectedFriendName(friendName);
  setSelectedFriendProfile(friendProfile);

  useChatStore.getState().setSelectedUser({
    _id: friendId,
    username: friendName,
    profileImage: friendProfile,
  });

  // Fetch previous messages when selecting a user
  useChatStore.getState().getMessages(friendId);
};


  return (
    <div className="flex h-screen bg-black">
    
   
    <Sidebar 
  user={user} 
  friends={friends} 
  onFriendSelect={handleFriendSelect} 
  toggleFriendsView={toggleFriendsView} 
/>

<ChatContainer 
  messages={friendMessages} 
  typing={typing}
  selectedFriend={{ 
    id: selectedFriendId, 
    name: selectedFriendName, 
    profile: selectedFriendProfile 
  }}
  onSendMessage={handleSendMessage}
/>

 
    </div>
  );
};

export default Chat;
