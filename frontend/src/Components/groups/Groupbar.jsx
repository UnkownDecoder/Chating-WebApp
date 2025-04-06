import React, { useState, useMemo, useEffect } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaCog,
  FaPlus
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import CreateGroupPopup from './CreateGroupPopup'; // Adjust path if necessary
import { useAuthStore } from "../../store/useAuthStore";
import { useGroupStore } from "../../store/useGroupStore";
import { useChatStore } from "../../store/useChatStore";

const Groupbar = ({ onExit }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const {
    authUser,
    friends,
    fetchFriends,
    isFetchingFriends,
  } = useAuthStore();

  const { selectedUser, setSelectedUser } = useChatStore();
  const { groups, fetchGroups, createGroup,setSelectedGroup,selectedGroup } = useGroupStore();

    // Mute / Deafen state
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (authUser?._id && isMounted) {
      console.log("Fetching friends and groups for user:", authUser._id);
      fetchFriends().catch(error => console.error("Error fetching friends:", error));
      fetchGroups().catch(error => console.error("Error fetching groups:", error));
    }
    return () => {
      isMounted = false;
    };
  }, [authUser?._id, fetchFriends, fetchGroups]);

 
     // ---- HANDLERS ----
  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleDeafen = () => setIsDeafened((prev) => !prev);
   const handleSettingsClick = () => navigate("/settings");

  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    const friendsArray = Array.isArray(friends) ? friends : friends.friends || [];
    return friendsArray.filter(friend => friend);
  }, [friends]);

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate('/chat');
    }
  };

  const handleNewGroup = () => {
    setIsPopupVisible(true);
  };

  const handleGroupClick = (group) => {
    setSelectedUser(null);
    console.log("group select:", group);
    setSelectedGroup(group);
    if (selectedGroup?._id === group._id) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
    setIsSidebarVisible(false);
    document.getElementById("Groupbar")?.classList.add("hidden");
  };

  return (
    <div
    id="Groupbar"
    className={`fixed inset-0 md:relative md:w-63 bg-gray-900 text-white p-4 flex flex-col h-full ${
      isSidebarVisible ? "block" : "hidden md:block"
    }`}
  >
  
      <div className="bg-gray-900 text-white p-4 flex flex-col h-full overflow-y-auto relative">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Groups"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

       

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleExit}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Exit
          </button>
          <button
            onClick={handleNewGroup}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            New Group
          </button>
        </div>

        {Array.isArray(groups) && groups.length > 0 && (
          <div className="mt-2 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Groups</h3>
            {groups
              .filter(group => group) // Filter out undefined/null groups
              .map((group) => (
                <div
                  key={group._id}
                  className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer 
                    ${
                      selectedGroup?._id === group._id
                        ? "bg-blue-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  onClick={() => handleGroupClick(group)}
                >
                 <img
                src={group.profileImage || "default-image-url"}
                alt={group.name}
                className="w-8 h-8 rounded-full mr-3"
              />
                  <span className="text-white">{group.name}</span>
                </div>
              ))}
          </div>
        )}

            {/* Bottom User/Settings Bar */}
                  <div className="absolute bottom-0 left-0 w-full bg-gray-900 p-2 flex items-center justify-between border-t border-gray-700 h-16 sm:h-20 z-30 md:flex">
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
        
                    <div className="flex space-x-3">
                      {/* Mute/Deafen Buttons */}
                      <button
                        className={`p-2 rounded ${
                          isMuted ? "text-red-500" : "text-white"
                        } hover:text-gray-400`}
                        onClick={toggleMute}
                      >
                        {isMuted ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
                      </button>
                      <button
                        className={`p-2 rounded ${
                          isDeafened ? "text-red-500" : "text-white"
                        } hover:text-gray-400`}
                        onClick={toggleDeafen}
                      >
                        {isDeafened ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                      </button>
        
                      {/* Settings Button */}
                      <button className="p-2 text-white hover:text-gray-400" onClick={handleSettingsClick}>
                        <FaCog size={16} />
                      </button>
                    </div>
                  </div>

        {/* Render the CreateGroupPopup when isPopupVisible is true */}
        {isPopupVisible && (
          <CreateGroupPopup
            friends={filteredFriends}
            onClose={() => setIsPopupVisible(false)}
            onCreateGroup={(groupData) => {
              createGroup(groupData); // Create group using store action
              fetchGroups(); // Refresh the group list after creation
              setIsPopupVisible(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Groupbar;
