import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const CreateGroupPopup = ({ friends, onClose, onCreateGroup }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFriendClick = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedFriends.length === 0) {
      alert("Please enter a group name and select at least one friend.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("members", JSON.stringify(selectedFriends));
    if (groupImage) {
      formData.append("profileImage", groupImage);
    }

    onCreateGroup(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Group</h2>
        
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="groupImage" className="cursor-pointer">
            {previewImage ? (
              <img src={previewImage} alt="Group Preview" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-sm">Upload</div>
            )}
          </label>
          <input
            id="groupImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 mb-4 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
        <div className="mb-4 max-h-64 overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center mb-2 p-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer relative"
              onClick={() => handleFriendClick(friend._id)}
            >
              <img
                src={friend.profileImage || "default-image-url"}
                alt={friend.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm">{friend.username}</span>
              {selectedFriends.includes(friend._id) && (
                <FaCheckCircle className="absolute top-0 right-0 text-blue-500" size={20} />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleCreateGroup}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Create Group
        </button>
        <button
          onClick={onClose}
          className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPopup;
