import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaPaperclip } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import AddFriends from './AddFriends';
import Sidebar from './Sidebar';

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




  useEffect(() => {
    const newSocket = io('http://localhost:5172', {
      query: { userId: userId },
    });
    setSocket(newSocket);
    newSocket.emit('register', userId);
    newSocket.on('newMessage', (msg) => {
      if (msg.receiverId === selectedFriendId || msg.senderId === selectedFriendId) {
        setFriendMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
    newSocket.on('typing', (username) => {
      setTyping(`${username} is typing...`);
    });
    return () => newSocket.close();
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
    formData.append('from', userId);
    formData.append('to', selectedFriendId);
    formData.append("text", message);
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5172/api/chat/send/${selectedFriendId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const newMessage = response.data;

      // **Update messages instantly for sender**
      setFriendMessages((prevMessages) => [...prevMessages, newMessage]);

      // **Emit message to receiver**
      socket.emit('newMessage', newMessage);

      // **Clear input fields**
      setMessage('');
      setFile(null);

    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  }
};



  const handleFriendSelect = (friendId, friendName) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    setFriendMessages([]);
  };

  return (
    <div className="flex h-screen bg-black">
    
   
  <Sidebar user={user} friends={friends} onFriendSelect={handleFriendSelect} toggleFriendsView={toggleFriendsView}/>

 

      <div className="flex-grow flex flex-col bg-gray-900 text-white border-l-2 border-r-2 border-gray-700">
        {showFriends ? (
          <AddFriends
            showAddFriendMessage={showAddFriendMessage}
            setShowAddFriendMessage={setShowAddFriendMessage}
            friendRequestMessage={friendRequestMessage}
            setFriendRequestMessage={setFriendRequestMessage}
          />
        ) : (
          <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-2">
  {selectedFriendId ? (
    <div className="flex flex-col space-y-2">
      {friendMessages.length > 0 ? (
        friendMessages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs mb-2 ${msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
            >
              <p>{msg.text || 'No message content'}</p>
              {msg.image && (
                <a href={msg.image} target="_blank" rel="noopener noreferrer" className="text-blue-300 mt-1">Download File</a>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-center">Start a conversation with this friend.</div>
      )}
    </div>
  ) : (
    <div className="text-gray-400 text-center">Select a friend to chat with.</div>
  )}
</div>


        )}
        {typing && <div className="p-2 text-gray-400 italic">{typing}</div>}
        {!showFriends && selectedFriendId && (
           <div className="p-4 bg-gray-800 flex items-center">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-900 text-white"
        placeholder={`Type a message to ${selectedFriendName}`}
        rows={1}
      />
      
      {/* File Upload */}
      <label htmlFor="file-upload" className="ml-2 cursor-pointer">
        <FaPaperclip size={24} className="text-white hover:text-gray-400" />
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />

      {/* Send Button */}
      <button onClick={handleSend} className="ml-2 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-purple-600">
        <IoMdSend size={24} />
      </button>
    </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
