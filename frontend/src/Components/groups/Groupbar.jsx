import React, { useState, useMemo, useEffect } from 'react';
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
      className={`fixed inset-0 md:relative md:w-55 bg-gray-900 text-white p-4 flex flex-col overflow-y-auto ${
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
          <div className="mt-4">
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
