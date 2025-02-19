import React, { useState } from "react";
import { 
  FaMicrophone, FaMicrophoneSlash, 
  FaVolumeUp, FaVolumeMute, 
  FaCog 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ user, friends, onFriendSelect, toggleFriendsView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const navigate = useNavigate();

  // Toggle Mute
  const toggleMute = () => setIsMuted((prev) => !prev);

  // Toggle Deafen
  const toggleDeafen = () => setIsDeafened((prev) => !prev);

  // Navigate to settings
  const handleSettingsClick = () => navigate("/settings");

  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        placeholder="Find or Start Conversation"
      />

      {/* Friends Button (UNCHANGED) */}
      <button
        className="w-full py-2 mb-4 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={toggleFriendsView} // KEEPING IT AS IT WAS
      >
        Friends
      </button>

      {/* Friends List */}
      <div className="mt-2">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer 
                ${selectedFriend === friend._id ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => {
                onFriendSelect(friend._id, friend.username);
                setSelectedFriend(friend._id);
              }}
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

      {/* User Info + Controls */}
      <div className="mt-auto flex items-center">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="User"
            className="rounded-full w-10 h-10 mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
        )}
        <span className="text-white font-semibold">
          {user?.username || "Guest"}
        </span>
        <div className="ml-auto flex space-x-4">
          {/* Mute Button */}
          <button
            className={`p-2 rounded-full ${isMuted ? "text-red-500" : "text-white"} hover:text-gray-400`}
            onClick={toggleMute}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          {/* Deafen Button */}
          <button
            className={`p-2 rounded-full ${isDeafened ? "text-red-500" : "text-white"} hover:text-gray-400`}
            onClick={toggleDeafen}
          >
            {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          {/* Settings Button */}
          <button
            className="p-2 text-white hover:text-gray-400"
            onClick={handleSettingsClick}
          >
            <FaCog />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
