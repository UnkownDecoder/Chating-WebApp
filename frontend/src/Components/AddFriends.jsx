import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendRequests from './FriendRequests';

const AddFriends = ({ showAddFriendMessage, setShowAddFriendMessage }) => {
  const [receiverIdentifier, setReceiverIdentifier] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [filter, setFilter] = useState('all'); 

  // Get the logged-in user's ID from localStorage
  const senderId = localStorage.getItem("userId") || '';

  useEffect(() => {
    if (senderId) fetchFriends();
  }, [senderId]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5172/api/user/friends/${senderId}`);
      setFriends(response.data.friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

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
        setIsRequestSent(true);
        alert('Friend request sent!');
        setReceiverIdentifier('');
        fetchFriends();
      }
    } catch (error) {
      alert('Error sending friend request!');
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = friends.filter(friend => (filter === 'all' ? true : friend.status === filter));

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
          <div className="flex space-x-4 mb-4">
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setFilter('online')}>Online</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setFilter('all')}>All</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setFilter('pending')}>Pending</button>
            <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setFilter('blocked')}>Blocked</button>
            <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg" onClick={() => setShowAddFriendMessage(true)}>Add Friend</button>
          </div>

          <FriendRequests/>
        </div>
      )}
    </div>
  );
};

export default AddFriends;
