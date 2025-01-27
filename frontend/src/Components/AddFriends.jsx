import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddFriends = ({ showAddFriendMessage, setShowAddFriendMessage }) => {
  const [receiverIdentifier, setReceiverIdentifier] = useState('');
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // Tracks the current tab
  const senderId = '123456'; // Replace this with the actual logged-in user's ID

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5172/api/friends/requests/${senderId}`);
      setFriendRequests([...response.data, botUser1, botUser2, fakeUser1, fakeUser2]);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleFriendAction = async (requestId, action) => {
    try {
      await axios.post(`http://localhost:5172/api/friends/${action}`, { requestId });
      alert(`Friend request ${action}ed successfully!`);
      fetchFriendRequests();
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    }
  };

  const sendFriendRequest = async () => {
    if (!receiverIdentifier.trim()) {
      alert('Please enter a valid username or user ID!');
      return;
    }

    setLoading(true);
    try {
      const receiverResponse = await axios.post('http://localhost:5172/api/auth/user/Addfriends', {
        identifier: receiverIdentifier,
      });

      if (receiverResponse.status === 200) {
        const receiverId = receiverResponse.data.user.id;

        await axios.post('http://localhost:5172/api/AddFriends', {
          senderId,
          receiverId,
        });

        setIsRequestSent(true);
        alert('Successfully sent friend request!');
        setReceiverIdentifier('');
        setShowAddFriendMessage(false);
      }
    } catch (error) {
      alert('Error sending friend request!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const botUser1 = {
    id: 'bot_001',
    user: {
      name: 'ChatBot AI',
      profilePicture: 'https://via.placeholder.com/50',
    },
  };

  const botUser2 = {
    id: 'bot_002',
    user: {
      name: 'Helper Bot',
      profilePicture: 'https://via.placeholder.com/50',
    },
  };

  const fakeUser1 = {
    id: 'fake_001',
    user: {
      name: 'FakeUser1',
      profilePicture: 'https://via.placeholder.com/50',
    },
  };

  const fakeUser2 = {
    id: 'fake_002',
    user: {
      name: 'FakeUser2',
      profilePicture: 'https://via.placeholder.com/50',
    },
  };

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
        <div className="flex justify-start items-center p-4 bg-gray-800 space-x-4">
          <span className="font-semibold text-xl mr-4">Friends</span>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setActiveTab('online')}>
            Online
          </button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setActiveTab('all')}>
            All
          </button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setActiveTab('pending')}>
            Pending
          </button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg" onClick={() => setActiveTab('blocked')}>
            Blocked
          </button>
          <button
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={() => setShowAddFriendMessage(true)}
          >
            Add Friend
          </button>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="p-4 bg-gray-800 rounded-lg mt-4">
          <h2 className="text-2xl font-semibold mb-4">Pending Friend Requests</h2>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg mb-2">
                <div className="flex items-center">
                  <img src={request.user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                  <span className="text-white font-semibold">{request.user.name}</span>
                </div>
                <div>
                  <button
                    onClick={() => handleFriendAction(request.id, 'accept')}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleFriendAction(request.id, 'reject')}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending friend requests</p>
          )}
        </div>
      )} 
    </div>
  );
};

export default AddFriends;