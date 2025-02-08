import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/chat.utils.js";
import { useAuthStore } from "../store/useAuthStore.js";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      console.log("Selected User:", selectedUser);
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      if (unsubscribeFromMessages) {
        unsubscribeFromMessages();
      }
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gray-900 text-white">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-900 text-white">
    <ChatHeader />
    <div className="flex-1 p-4 overflow-auto space-y-4">
      {messages.length > 0 ? (
        messages.map((message, index) => {
          const isSentByCurrentUser = message.senderId === authUser._id;
          return (
            <div
              key={message._id ? `${message._id}-${index}` : `msg-${index}`}
              className={`flex items-end space-x-3 ${
                isSentByCurrentUser ? "justify-end" : "justify-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null} // Ensure ref is set for the last message
            >
              {!isSentByCurrentUser && (
                <img
                  src={selectedUser?.profileImage || "/images/default-profile.png"}
                  alt={`${selectedUser?.username || "User"}'s profile`}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
              )}

              <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
                  isSentByCurrentUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Sent attachment"
                    className="w-full max-w-xs rounded-md mb-2"
                  />
                )}
                {message.text && <p className="break-words">{message.text}</p>}
                <time className="block text-xs text-gray-400 text-right mt-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {isSentByCurrentUser && (
                <img
                  src={authUser?.profileImage || "/images/default-profile.png"}
                  alt="Your profile"
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500">No messages yet. Say hello!</div>
      )}
    </div>
    <MessageInput />
  </div>
);
};

export default ChatContainer;
