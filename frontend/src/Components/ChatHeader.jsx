import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isMessagesLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const handleClose = () => {
    setSelectedUser(null);
    document.getElementById("sidebar").classList.remove("hidden");
  };

  const isGroup = !!selectedUser?.members;
  const profileImage = isGroup ? "/images/group-icon.png" : selectedUser?.profileImage || "/images/default-profile.png";
  const displayName = isGroup ? selectedUser.name : selectedUser?.username || "Unknown User";
  const isOnline = isGroup ? null : selectedUser?._id && onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
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

        {/* Back Button (Mobile) */}
        <button
          onClick={handleClose}
          className="btn btn-circle md:hidden flex items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Close Button (Desktop) - Fix Circle Alignment */}
        <button
          onClick={handleClose}
          className="btn btn-circle hidden md:flex items-center justify-center"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
