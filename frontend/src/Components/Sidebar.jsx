import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  //online users only 
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFriendsView, setShowFriendsView] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Mute state
  const [isDeafened, setIsDeafened] = useState(false); // Deafen state

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  //filtered users and only shown online users
  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

  const toggleFriendsView = () => {
    setShowFriendsView(!showFriendsView);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted); // Toggle the mute state
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened); // Toggle the deafen state
  };

  const handleSettingsClick = () => {
    // You can define what happens when the settings icon is clicked.
    // For example, you can log to the console or open a settings modal
    console.log('Settings clicked');
    // If you want to open a modal or navigate, you can implement that here
  };

  if (isUsersLoading) return <div>Loading...</div>;

  return (
    <div style={{ width: '250px' }} className="bg-gray-900 text-white p-4 flex flex-col justify-between">
      <input
        type="text"
        value={searchQuery}
        
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        placeholder="Find or Start Conversation"
        style={{ height: '35px', fontSize: '14px' }}
      />
      <button
        className="w-full py-2 mb-4 bg-transparent text-left text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={toggleFriendsView}
      >
        Friends
      </button>

      {showFriendsView && (
        <div className="overflow-y-auto w-full py-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors ${selectedUser?.id === user.id ? "bg-gray-800 ring-1 ring-nase-300" : ""}`}
            >
              <div className="relative max-auto lg:mx-0">
                <img
                  src={user.profileImage || "/images/default-profile.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full" />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.username}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user.id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center mb-4">
        {selectedUser && (
          <>
            <img
              src={selectedUser.profileImage || "/images/default-profile.png"}
              alt="User"
              className="rounded-full w-10 h-10 mr-3"
            />
            <span className="text-white font-semibold">{selectedUser.username}</span>
          </>
        )}
        <div className="ml-auto flex space-x-4">
          <div className="relative group">
            <button className="text-white hover:text-gray-400" onClick={toggleMute}>
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
          </div>
          <div className="relative group">
            <button className="text-white hover:text-gray-400" onClick={toggleDeafen}>
              {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
          <div className="relative group">
            <button className="text-white hover:text-gray-400" onClick={handleSettingsClick}>
              <FaCog />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
