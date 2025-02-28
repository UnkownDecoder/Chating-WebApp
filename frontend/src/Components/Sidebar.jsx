import React, { useState, useEffect, useMemo } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import CreateGroupPopup from "./CreateGroupPopup";

const Sidebar = ({ toggleFriendsView }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { authUser, friends, fetchFriends, isFetchingFriends } = useAuthStore();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [groups, setGroups] = useState([]);

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

  useEffect(() => {
    let isMounted = true;
    if (authUser?._id && isMounted) {
      console.log("Fetching friends for user:", authUser._id);
      fetchFriends().catch((error) => {
        console.error("Error fetching friends:", error);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [authUser?._id, fetchFriends]);

  useEffect(() => {
    if (friends) {
      console.log("friends are :", friends);
    }
  }, [friends]);

  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    // Handle both array and object response formats
    const friendsArray = Array.isArray(friends) ? friends : friends.friends || [];
    return friendsArray.filter((friend) => {
      if (!friend) return false;
      console.log("Friend:", friend);
      return true;
    });
  }, [friends]);

  // Handle friend click
  const handleFriendClick = (friend) => {
    if (selectedUser?._id === friend._id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(friend);
    }
    setIsSidebarVisible(false); // Hide sidebar on mobile after selecting a friend
    document.getElementById("sidebar").classList.add("hidden"); // Hide sidebar on mobile
  };

  // Handle group click
  const handleGroupClick = (group) => {
    setSelectedUser(group);
    setIsSidebarVisible(false); // Hide sidebar on mobile after selecting a group
    document.getElementById("sidebar").classList.add("hidden"); // Hide sidebar on mobile
  };

  // Handle group creation
  const handleCreateGroup = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  return (
    <div
      id="sidebar"
      className={`fixed inset-0 md:relative md:w-64 bg-gray-900 text-white p-4 flex flex-col ${
        isSidebarVisible ? "block" : "hidden md:block"
      }`}
    >
      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        placeholder="Find or Start Conversation"
      />

      {/* Friends Button */}
      <button
        className="w-full py-2 mb-2 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={toggleFriendsView}
      >
        Friends
      </button>

      {/* Plus Button placed directly below Friends Button */}
      <button
        className="mt-2 bg-gray-800 hover:bg-gray-700 p-2 w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all z-40"
        onClick={() => setIsPopupVisible(true)}
      >
        <FaPlus className="text-white text-lg" />
      </button>

      {/* Friends List */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {isFetchingFriends ? (
          <div className="flex items-center justify-center">
            <div className="loading loading-spinner text-primary"></div>
            <p className="text-gray-400 text-sm ml-2">Loading friends...</p>
          </div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend._id}
              className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer ${
                selectedUser?._id === friend._id ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => handleFriendClick(friend)}
            >
              <img
                src={friend.profileImage || "default-image-url"}
                alt={friend.username}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="text-white">{friend.username}</span>
              {friend.status === "online" && (
                <span className="ml-auto text-sm text-green-400">Online</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No friends added yet.</p>
        )}

        {/* Groups List */}
        {groups.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Groups</h3>
            {groups.map((group) => (
              <div
                key={group.id}
                className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer ${
                  selectedUser?.id === group.id ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => handleGroupClick(group)}
              >
                <span className="text-white">{group.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info + Controls */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-900 p-2 flex items-center justify-between border-t border-gray-700 h-16 sm:h-20 z-30 md:flex">
        {/* User Avatar & Name */}
        <div className="flex items-center space-x-2">
          {authUser?.profileImage ? (
            <img
              src={authUser.profileImage}
              alt="User"
              className="rounded-full w-10 h-10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          )}
          <span className="text-white text-sm truncate">
            {authUser?.username || "Guest"}
          </span>
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          <button
            className={`p-2 rounded ${isMuted ? "text-red-500" : "text-white"} hover:text-gray-400`}
            onClick={toggleMute}
          >
            {isMuted ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
          </button>

          <button
            className={`p-2 rounded ${isDeafened ? "text-red-500" : "text-white"} hover:text-gray-400`}
            onClick={toggleDeafen}
          >
            {isDeafened ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </button>

          <button
            className="p-2 text-white hover:text-gray-400"
            onClick={handleSettingsClick}
          >
            <FaCog size={16} />
          </button>
        </div>
      </div>

      {/* Create Group Popup */}
      {isPopupVisible && (
        <CreateGroupPopup
          friends={filteredFriends}
          onClose={() => setIsPopupVisible(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default Sidebar;
