import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/chat.utils.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";
import { X } from "lucide-react"; // Close button icon
import GroupChatHeader from "./groups/GroupHeader.jsx";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages,
    sendMessage: sendMessageToServer,
    typingUsers
  } = useChatStore();

  const {
    messages: groupMessages,
    getMessages: getGroupMessages,
    selectedGroup,
    sendMessage: sendGroupMessage,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    setGroupMessages,
    typingUsers: groupTypingUsers
  } = useGroupStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullMedia, setFullMedia] = useState(null); // For viewing media full-screen
  const messagesContainerRef = useRef(null);

  // Check if it's a group chat or single user chat
  const isGroupChat = Boolean(selectedGroup?._id);

  const selectedChat = isGroupChat ? selectedGroup : selectedUser;

  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        setMessages([]); // Clear messages before fetching new ones
        setGroupMessages([]); // Clear messages before fetching new ones
        if (isGroupChat) {
          await getGroupMessages(selectedChat._id);
          subscribeToGroupMessages();
        } else {
          await getMessages(selectedChat._id);
          subscribeToMessages();
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages.");
      }
    };

    fetchMessages();
    return () => {
      isGroupChat ? unsubscribeFromGroupMessages() : unsubscribeFromMessages();
    };
  }, [selectedChat?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, groupMessages]);

  const handleSendMessage = async (text, messageType, mediaUrl = null) => {
    if (!text && !mediaUrl) return;

    const message = {
      text,
      messageType,
      mediaUrl,
      senderId: authUser._id,
      createdAt: new Date(),
    };

    if (isGroupChat) {
      message.groupId = selectedChat._id;
      setGroupMessages((prev) => [...prev, message]);

      try {
        await sendGroupMessage(message);
      } catch (error) {
        console.error("Error sending group message:", error);
        toast.error("Failed to send group message.");
      }
    } else {
      message.receiverId = selectedChat._id;
      setMessages((prev) => [...prev, message]);

      try {
        await sendMessageToServer(message);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message.");
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a user or group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10  bg-gray-900">
        {isGroupChat ? <GroupChatHeader /> : <ChatHeader title={selectedChat.name || selectedChat.username} />}
      </div>

      {/* Scrollable Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        ref={messagesContainerRef}
      >
        {(isGroupChat ? groupMessages : messages).map((message, index) => {
          const isSender = isGroupChat ? message.sender._id === authUser._id : message.senderId._id === authUser._id;

          const senderProfileImage = isSender
            ? authUser?.profileImage || "/images/default-profile.png"
            : isGroupChat
            ? message.sender.profileImage || "/images/default-profile.png"
            : selectedUser?.profileImage || "/images/default-profile.png";

          return (
            <div
              key={message._id || index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={index === (isGroupChat ? groupMessages : messages).length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={senderProfileImage} alt="Profile Pic" />
                </div>
              </div>
              <div className="chat-header">
                {!isSender && (
                  <span className="text-sm p-2 font-semibold">
                    {isGroupChat ? message.sender.username : message.senderId.username}
                  </span>
                )}
              </div>
              <div className="chat-bubble">
                {message.messageType === "image" && (
                  <img
                    src={message.mediaUrl}
                    alt="Attachment"
                    className="w-40 rounded-md cursor-pointer"
                    onClick={() => setFullMedia({ type: "image", url: message.mediaUrl })}
                  />
                )}
                {message.messageType === "video" && (
                  <video controls className="w-40 rounded-md cursor-pointer">
                    <source src={message.mediaUrl} type="video/mp4" />
                  </video>
                )}
                {message.messageType === "audio" && (
                  <audio controls>
                    <source src={message.mediaUrl} type="audio/mp3" />
                  </audio>
                )}
                {message.messageType === "document" && (
                  <a
                    href={message.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline cursor-pointer"
                  >
                    View Document
                  </a>
                )}
                {isGroupChat ? message.messageType && <p>{message.message}</p> : message.text && <p>{message.text}</p>}
                <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {(Object.keys(typingUsers).length > 0 || Object.keys(groupTypingUsers).length > 0) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg w-fit">
            <span className="text-sm text-gray-300">
              {Object.keys(groupTypingUsers).length > 0
                ? `${Object.values(groupTypingUsers).join(", ")} ${Object.keys(groupTypingUsers).length > 1 ? "are" : "is"} typing...`
                : `${Object.values(typingUsers).join(", ")} ${Object.keys(typingUsers).length > 1 ? "are" : "is"} typing...`}
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Fixed Message Input */}
      <div className="sticky bottom-0  bg-gray-900 p-4">
        <MessageInput onSendMessage={handleSendMessage} isGroup={isGroupChat} />
      </div>

      {/* Full-Screen Media Preview */}
      {fullMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white bg-red-600 p-2 rounded-full"
            onClick={() => setFullMedia(null)}
          >
            <X size={24} />
          </button>
          {fullMedia.type === "image" ? (
            <img src={fullMedia.url} alt="Full View" className="max-w-full max-h-full rounded-md" />
          ) : (
            <video controls className="max-w-full max-h-full rounded-md">
              <source src={fullMedia.url} type="video/mp4" />
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
