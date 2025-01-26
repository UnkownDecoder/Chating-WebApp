import React, { useState } from 'react';
import axios from 'axios';

const AddFriends = ({
  showAddFriendMessage,
  setShowAddFriendMessage,
}) => {
  const [receiverIdentifier, setReceiverIdentifier] = useState(''); // To store receiver's username or ID
  const [isRequestSent, setIsRequestSent] = useState(false); // To track if the request was sent
  const [loading, setLoading] = useState(false); // To handle loading state
  const senderId = '123456'; // Replace this with the actual logged-in user's ID from context/auth

  const sendFriendRequest = async () => {
    if (!receiverIdentifier.trim()) {
      alert('Please enter a valid username or user ID!');
      return;
    }

    setLoading(true); // Start loading when the request is sent
    try {
      // Check if the user exists in the database by username or user ID
      const receiverResponse = await axios.post('http://localhost:5172/api/auth/user/Addfriends', {
        identifier: receiverIdentifier, // Send the receiver's username or user ID
      });

      if (receiverResponse.status === 200) {
        const receiverId = receiverResponse.data.user.id; // Assuming the user object contains the 'id'
        
        // Now send the friend request
        const friendRequestResponse = await axios.post('http://localhost:5172/api/AddFriends', {
          senderId,
          receiverId,
        });

        if (friendRequestResponse.status === 200) {
          setIsRequestSent(true);
          alert('Successfully sent friend request!');
          setReceiverIdentifier(''); // Clear the receiver input field after sending
          setShowAddFriendMessage(false); // Close the add friend form
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert('User not found! Please check the username or ID.');
      } else {
        console.error('Error sending friend request:', error);
        alert('Error sending friend request!');
      }
    } finally {
      setLoading(false); // Stop loading after request is done
    }
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
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Online</button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">All</button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Pending</button>
          <button className="p-2 bg-transparent hover:bg-gray-700 rounded-lg">Blocked</button>
          <button
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={() => setShowAddFriendMessage(true)}
          >
            Add Friend
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFriends;
