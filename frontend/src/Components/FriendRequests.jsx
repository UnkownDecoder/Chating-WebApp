import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5172/api/user/pendingRequests/${userId}`);
      setRequests(response.data.pendingRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const respondToRequest = async (senderId, action) => {
    try {
      const response = await axios.post('http://localhost:5172/api/user/respondToFriendRequest', {
        receiverId: userId,
        senderId,
        action,
      });

      alert(response.data.message);
      fetchPendingRequests(); // Refresh list after action
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2">Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id} className="flex justify-between items-center p-2 border-b">
              <span>{request.username}</span>
              <div>
                <button
                  onClick={() => respondToRequest(request._id, 'accept')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(request._id, 'reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
