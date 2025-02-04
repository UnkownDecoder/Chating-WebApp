import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';

const Sidebar = ({ loggedInUser, users, selectedUser, setSelectedUser }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showFriendsView, setShowFriendsView] = useState(false);

  const toggleFriendsView = () => setShowFriendsView(!showFriendsView);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleDeafen = () => setIsDeafened(!isDeafened);

  return (
    <div className="bg-gray-900 text-white p-4 flex flex-col justify-between w-64">
      {/* Friends Button */}
      <button className="w-full py-2 mb-4 text-left hover:bg-gray-700" onClick={toggleFriendsView}>
        Friends
      </button>

      {/* Friends List */}
      {showFriendsView && (
        <div className="overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full py-3 flex items-center gap-3 hover:bg-gray-800 ${
                selectedUser?.id === user.id ? 'bg-gray-800 ring-1 ring-gray-300' : ''
              }`}
            >
              <img
                src={user.profileImage || '/images/default-profile.png'}
                alt={user.username}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div>
                <div className="font-medium truncate">{user.username}</div>
                <div className="text-sm text-gray-400">Online</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Logged-in User Profile Section */}
      {loggedInUser && (
        <div className="mt-auto flex items-center bg-gray-800 p-3 rounded-lg">
          <img
            src={loggedInUser.profileImage || '/images/default-profile.png'}
            alt={loggedInUser.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold truncate">{loggedInUser.username}</span>
          <div className="ml-auto flex space-x-4">
            <button className="text-white hover:text-gray-400" onClick={toggleMute}>
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button className="text-white hover:text-gray-400" onClick={toggleDeafen}>
              {isDeafened ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button className="text-white hover:text-gray-400">
              <FaCog />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
