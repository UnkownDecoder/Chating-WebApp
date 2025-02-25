import React from "react";
import { X, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isMessagesLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const handleBackClick = () => {
    setSelectedUser(null);
    // Add logic to show the sidebar again
    document.getElementById('sidebar').classList.remove('hidden');
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser?.profileImage || "/images/default-profile.png"} 
                alt={selectedUser?.username || "User"} 
              />
              {isMessagesLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
            </div>
          </div>

          {/* user info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username || "Unknown User"}</h3>
            <p className="text-sm text-base-content/70">
              {selectedUser?._id && onlineUsers.includes(selectedUser._id) 
                ? "Online" 
                : "Offline"}
            </p>
          </div>
        </div>

        {/* close/back button */}
        <button 
          onClick={handleBackClick} 
          className="btn btn-circle md:hidden"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={() => setSelectedUser(null)} 
          className="btn btn-circle hidden md:block"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;