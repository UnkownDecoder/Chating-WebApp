import React, { useState } from 'react';
import AddFriends from './AddFriends';

const ParentComponent = () => {
  const [showAddFriendMessage, setShowAddFriendMessage] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');

  return (
    <div>
      <AddFriends
        showAddFriendMessage={showAddFriendMessage}
        setShowAddFriendMessage={setShowAddFriendMessage}
        friendRequestMessage={friendRequestMessage}
        setFriendRequestMessage={setFriendRequestMessage}
      />
    </div>
  );
};

export default ParentComponent;
