import React, { useState } from "react";
import { X, ArrowLeft, Phone, Video } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isMessagesLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [callActive, setCallActive] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);

  if (!selectedUser) return null;

  const handleClose = () => {
    setSelectedUser(null);
    document.getElementById("sidebar").classList.remove("hidden");
  };

  const handleCall = () => {
    // Initiate audio call logic (simulate with modal)
    setCallActive(true);
  };

  const handleVideoCall = () => {
    // Initiate video call logic (simulate with modal)
    setVideoCallActive(true);
  };

  const isGroup = !!selectedUser?.members;
  const profileImage = isGroup
    ? "/images/group-icon.png"
    : selectedUser?.profileImage || "/images/default-profile.png";
  const displayName = isGroup
    ? selectedUser.name
    : selectedUser?.username || "Unknown User";
  const isOnline = isGroup
    ? null
    : selectedUser?._id && onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={profileImage} alt={displayName} />
              {isMessagesLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
            </div>
          </div>

          {/* User/Group Info */}
          <div>
            <h3 className="font-medium">{displayName}</h3>
            {!isGroup && (
              <p className="text-sm text-base-content/70">
                {isOnline ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Mobile: Back Button */}
        <button
          onClick={handleClose}
          className="btn btn-circle md:hidden flex items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Desktop: Call, Video Call, and Close Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleCall}
            className="btn btn-circle flex items-center justify-center"
          >
            <Phone className="h-6 w-6" />
          </button>
          <button
            onClick={handleVideoCall}
            className="btn btn-circle flex items-center justify-center"
          >
            <Video className="h-6 w-6" />
          </button>
          <button
            onClick={handleClose}
            className="btn btn-circle flex items-center justify-center"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Audio Call Modal */}
      {callActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Audio Call in Progress</h2>
            <p>Calling {displayName}...</p>
            <button
              onClick={() => setCallActive(false)}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Hang Up
            </button>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {videoCallActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Video Call in Progress</h2>
            <p>Video calling {displayName}...</p>
            <button
              onClick={() => setVideoCallActive(false)}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Hang Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
