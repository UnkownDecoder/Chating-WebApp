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
  } = useChatStore();

  const {
    messages:groupMessages,
    getMessages:getGroupMessages,
    selectedGroup,
    sendMessage: sendGroupMessage,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    setGroupMessages,
  } = useGroupStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullMedia, setFullMedia] = useState(null); // For viewing media full-screen

  // Check if it's a group chat or single user chat
  const isGroupChat = Boolean(selectedGroup?._id);
  console.log("isGroupChat:", isGroupChat);
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

  console.log("Messages:", groupMessages);

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
    <div className="flex-1 flex flex-col overflow-auto">
     
      {(isGroupChat ? <GroupChatHeader/> :  <ChatHeader title={selectedChat.name || selectedChat.username} />)}
      <div className="flex-1 p-4 space-y-2">
        {(isGroupChat ? groupMessages : messages).map((message, index) => {
          
          
          const isSender = isGroupChat ? message.sender._id === authUser._id : message.senderId._id === authUser._id;

          const senderProfileImage = isSender
            ? authUser?.profileImage || "/images/default-profile.png"
            : isGroupChat
            ?  message.sender.profileImage || "/images/default-profile.png"
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
                  <span className="text-sm p-2 font-semibold">{isGroupChat ? message.sender.username : message.senderId.username}</span>
                )}
               
              </div>
              <div className="chat-bubble">
                {/* Image Preview */}
                {message.messageType === "image" && (
                  <img
                    src={message.mediaUrl}
                    alt="Attachment"
                    className="w-40 rounded-md cursor-pointer"
                    onClick={() => setFullMedia({ type: "image", url: message.mediaUrl })}
                  />
                )}

                {/* Video Preview */}
                {message.messageType === "video" && (
                  <video controls className="w-40 rounded-md cursor-pointer">
                    <source src={message.mediaUrl} type="video/mp4" />
                  </video>
                )}

                {/* Audio Preview */}
                {message.messageType === "audio" && (
                  <audio controls>
                    <source src={message.mediaUrl} type="audio/mp3" />
                  </audio>
                )}

                {/* Document Link */}
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

                {/* Text Message */}
                {isGroupChat ? message.messageType && <p>{message.message}</p> : message.text && <p>{message.text}</p>}
                <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
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

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isGroup={isGroupChat} />
    </div>
  );
};

export default ChatContainer;
