import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendRequests from './FriendRequests';

const AddFriends = ({ showAddFriendMessage, setShowAddFriendMessage }) => {
  const [receiverIdentifier, setReceiverIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [filter, setFilter] = useState('all'); 

  // Get the logged-in user's ID from localStorage
  const senderId = localStorage.getItem("userId") || '';

  useEffect(() => {
    if (senderId) fetchFriends();
  }, [senderId]);

  // Fetch friends list
  const fetchFriends = async (isOnlineOnly = false) => {
    try {
      let url = `http://localhost:5172/api/user/friends/${senderId}`;
      if (isOnlineOnly) {
        url = `http://localhost:5172/api/user/online-friends/${senderId}`;
      }
      
      const response = await axios.get(url);
      
      // If fetching online friends, add the "status" field
      const friendsWithStatus = response.data.friends.map(friend => {
        if (isOnlineOnly) {
          return { ...friend, status: "online" }; // Only add "status" for online friends
        }
        return friend; // Keep original object for "All" friends
      });
  
      setFriends(friendsWithStatus);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  
  
  // Send friend request
  const sendFriendRequest = async () => {
    if (!receiverIdentifier.trim()) {
      alert('Please enter a valid username or user ID!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5172/api/user/AddFriends', {
        senderId,
        identifier: receiverIdentifier,
      });

      if (response.status === 200) {
        alert('Friend request sent!');
        setReceiverIdentifier('');
        fetchFriends(); // Refresh friends list
      }
    } catch (error) {
      alert('Error sending friend request!');
    } finally {
      setLoading(false);
    }
  };

  // Filter friends list based on selection
  const filteredFriends = friends.filter(friend => {
    if (filter === 'all') return true;
    if (filter === 'online') return friend.status === 'online';
    if (filter === 'pending') return friend.status === 'pending';
    if (filter === 'blocked') return friend.status === 'blocked';
    return true;
  });

  return (
    <div>
      {showAddFriendMessage ? (
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-2">Add Friend</h2>
          <input
            type="text"
            value={receiverIdentifier}
            onChange={(e) => setReceiverIdentifier(e.target.value)}
            placeholder="Enter username or user ID"
            className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white mb-2"
          />
          <button
            onClick={sendFriendRequest}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-500"
            disabled={loading || !receiverIdentifier.trim()}
          >
            {loading ? 'Sending...' : 'Send Friend Request'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col p-4 bg-gray-800">
          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-4">
          <button 
  className={`p-2 rounded-lg ${filter === 'online' ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-700`}
  onClick={() => {
    setFilter('online');
    fetchFriends(true); // Fetch only online friends
  }}
>
  Online
</button>
<button 
  className={`p-2 rounded-lg ${filter === 'all' ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-700`}
  onClick={() => {
    setFilter('all');
    fetchFriends(false); // Fetch all friends
  }}
>
  All
</button>

            <button 
              className={`p-2 rounded-lg ${filter === 'pending' ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-700`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`p-2 rounded-lg ${filter === 'blocked' ? 'bg-gray-700' : 'bg-transparent'} hover:bg-gray-700`}
              onClick={() => setFilter('blocked')}
            >
              Blocked
            </button>
            <button 
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              onClick={() => setShowAddFriendMessage(true)}
            >
              Add Friend
            </button>
          </div>

          {/* Conditionally show Friend Requests if 'Pending' is selected */}
          {filter === 'pending' && <FriendRequests userId={senderId} />}

          {/* Display Friends List */}
          {filter !== 'pending' && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-white mb-2">{filter === 'all' ? 'All Friends' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Friends`}</h2>
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div key={friend._id} className="flex items-center p-2 bg-gray-800 rounded-lg mb-2">
                    <img
                      src={friend.profileImage || "default-image-url"}
                      alt={friend.username}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="text-white">{friend.username}</span>
                    {filter === 'online' && (
  <span className="ml-auto text-sm text-green-400">Online</span>
)}

                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No {filter !== 'all' ? filter : ''} friends found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriends;
