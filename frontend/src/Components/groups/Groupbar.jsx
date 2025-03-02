import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateGroupPopup from '../CreateGroupPopup'; // Adjust path if necessary

const Groupbar = ({ onExit }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Dummy data for friends; replace with actual friends data if available.
  const filteredFriends = [];

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

  // Placeholder function for handling group creation
  const handleCreateGroup = (newGroup) => {
    console.log("New group created:", newGroup);
    setIsPopupVisible(false);
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
          onClick={handleNewGroup}
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
