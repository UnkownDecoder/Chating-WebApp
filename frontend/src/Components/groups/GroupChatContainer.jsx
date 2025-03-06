import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import GroupMessageInput from "./GroupMessageInput.jsx";
import { formatMessageTime } from "../lib/chat.utils.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const GroupChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setMessages,
    sendMessage: sendMessageToServer,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullImage, setFullImage] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        await getMessages(selectedUser._id, true);
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

  const handleSendMessage = async (text, messageType, mediaUrl = null) => {
    if (!text && !mediaUrl) return;

    const message = {
      text,
      messageType,
      mediaUrl,
      senderId: authUser._id,
      groupId: selectedUser._id,
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, message]);

    try {
      await sendMessageToServer(message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader title={selectedUser.name} />
      <div className="flex-1 p-4 space-y-2">
        {messages.map((message, index) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id || index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-header">
                <span className="font-semibold">{message.senderId.username}</span>
                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
              </div>
              <div className="chat-bubble">
                {message.messageType === "image" && <img src={message.mediaUrl} alt="Attachment" className="w-40 rounded-md" />}
                {message.messageType === "video" && <video controls className="w-40 rounded-md"><source src={message.mediaUrl} type="video/mp4" /></video>}
                {message.messageType === "audio" && <audio controls><source src={message.mediaUrl} type="audio/mp3" /></audio>}
                {message.messageType === "document" && <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Document</a>}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <GroupMessageInput onSendMessage={handleSendMessage} isGroup={true} />
    </div>
  );
};

export default GroupChatContainer;
