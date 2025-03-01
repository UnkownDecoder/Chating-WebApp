import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGroupPopup from '../CreateGroupPopup'; // Adjust path if necessary

const Groupbar = ({ onExit }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // NEW: Open the CreateGroupPopup when New Group is clicked

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate('/chat');
    }
  };

  // NEW: Open the CreateGroupPopup when New Group is clicked
  

  // NEW: This function will be called after a new group is created
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleCreateGroup = (newGroup) => {
    groups((prevGroups) => [...prevGroups, newGroup]);
  };
  

  return (
    <div className="bg-gray-900 text-white p-4 flex flex-col h-full overflow-y-auto relative">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Groups"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <h2 className="text-2xl font-bold mb-6">Groups</h2>
      
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleExit}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Exit
        </button>
        <button
          onClick={() => setIsPopupVisible(true)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          New Group
        </button>
      </div>

      {/* Render the CreateGroupPopup when isPopupVisible is true */}
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

export default Groupbar;
