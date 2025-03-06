import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";
import { useGroupStore } from "../store/useGroupStore";

const Chat = () => {
  const { socket, connectSocket } = useAuthStore();
  const { selectedUser, setSelectedUser, getUsers, users } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();

  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState('');
  const [showFriends, setShowFriends] = useState(false);
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');
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
    if (!socket || !socket.connected) {
      connectSocket();
    }
  }, [socket, connectSocket]);

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
      await useAuthStore.getState().getUserProfile();
    } catch (error) {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
    }
  };

  const fetchFriends = async () => {
    try {
      await getUsers();
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleFriendSelect = (friendId, friendName) => {
   
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    const selectedFriend = users.find((friend) => friend._id === friendId);
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
        friends={users} 
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
          (!selectedUser && !selectedGroup ? <NoChatSelected /> : <ChatContainer /> )
        )}
      </div>
    </div>
  );
};

export default Chat;