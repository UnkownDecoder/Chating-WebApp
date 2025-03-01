import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/chat.utils.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages, // Assuming this is available to update local messages
    sendMessage: sendMessageToServer, // Import your sendMessage function
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullImage, setFullImage] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        await getMessages(selectedUser._id, !!selectedUser?.members);
        subscribeToMessages();
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages.");
      }
    };

    fetchMessages();
    
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageClick = (imageUrl) => setFullImage(imageUrl);
  const closeImageModal = () => setFullImage(null);

  const handleSendMessage = async (text) => {
    if (!text) return;

    const message = {
      text,
      senderId: authUser._id,
      groupId: selectedUser._id,
      createdAt: new Date(),
    };

    // Optimistically add the new message to the local state
    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      await sendMessageToServer(message); // Replace with your actual send message function
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
      // Optionally handle error (e.g., remove the optimistic message)
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto hidden md:flex">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a user or group to start chatting</p>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto hidden md:flex">
        <ChatHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="loading loading-spinner text-primary"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col overflow-auto ${selectedUser ? "block" : "hidden md:block"}`}
    >
      <ChatHeader title={selectedUser?.members ? selectedUser.name : selectedUser.username} />
      
      <div className="flex-1 flex flex-col overflow-auto p-4 space-y-2">
        {messages.map((message, index) => {
          const isGroupMessage = !!message.groupId;
          const isSender = message.senderId._id && message.senderId._id === authUser?._id.toString();

          const senderProfileImage = isSender
            ? authUser?.profileImage || "/images/default-profile.png"
            : isGroupMessage
            ? selectedUser?.members?.find((m) => m._id === message.senderId._id)?.profileImage || "/images/default-profile.png"
            : selectedUser?.profileImage || "/images/default-profile.png";

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"} animate-fade-in`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={senderProfileImage} alt="Profile Pic" />
                </div>
              </div>
              <div className="chat-header mb-1">
                {!isSender && (
                  <span className="text-sm font-semibold">{isGroupMessage ? message.senderId.name : selectedUser.username}</span>
                )}
                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
              </div>
              <div className="chat-bubble flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                    onClick={() => handleImageClick(message.image)}
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
        
        {/* Scroll to the last message */}
        <div ref={messageEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} isGroup={!!selectedUser?.members} />

      {fullImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={closeImageModal}>
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white text-3xl font-bold cursor-pointer" onClick={closeImageModal}>
              &times;
            </button>
            <img src={fullImage} alt="Full Preview" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;