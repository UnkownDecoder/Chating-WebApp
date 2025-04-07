import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, FileText, Video, Mic } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore"; // Import group store
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);

    const { sendMessage: sendUserMessage, selectedUser } = useChatStore();
    const { sendMessage: sendGroupMessage, selectedGroup, groupSocket } = useGroupStore(); // Access group chat
    const { authUser , socket} = useAuthStore(); 

    const handleEmojiSelect = (emoji) => {
        setText((prev) => prev + emoji.native);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type;
        let messageType = "text"; 

        if (fileType.startsWith("image/")) messageType = "image";
        else if (fileType.startsWith("video/")) messageType = "video";
        else if (fileType.startsWith("audio/")) messageType = "audio";
        else messageType = "document"; 

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setFilePreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setFileType(messageType);
    };

    const removeFile = () => {
        setFilePreview(null);
        setSelectedFile(null);
        setFileType(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        if (!socket) return;
      
        if (!selectedUser && !selectedGroup) return;
     

        const typingTimeout = setTimeout(() => {
            if (text.trim().length) {
                console.log("hello");
                if (!isTyping) {
                    console.log('Emitting startTyping event');
                    if (selectedUser) {
                        console.log('To user:', selectedUser._id);
                        socket.emit("startTyping", { 
                            userId: selectedUser._id,
                            username: authUser.username
                        });
                    }
                    if (selectedGroup) {
                        console.log('To group:', selectedGroup._id);
                        socket.emit("startTyping", { 
                            groupId: selectedGroup._id, 
                            userId: authUser._id, 
                            username: authUser.username 
                        });
                    }
                    setIsTyping(true);
                }
            } else {
                if (isTyping) {
                    console.log('Emitting stopTyping event');
                    if (selectedUser) {
                        socket.emit("stopTyping", { 
                            userId: selectedUser._id 
                        });
                    }
                    if (selectedGroup) {
                        socket.emit("stopTyping", { 
                            groupId: selectedGroup._id, 
                            userId: authUser._id 
                        });
                    }
                    setIsTyping(false);
                }
            }
        }, 100);

        return () => clearTimeout(typingTimeout);
    }, [text, isTyping, socket, selectedUser, selectedGroup, authUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("messageType", fileType || "text");

            if (text.trim()) {
                formData.append("text", text.trim());
            }

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            // Check if it's a group message or single-user message
            if (selectedGroup) {
                await sendGroupMessage(formData); 
                if (socket) socket.emit("stopTyping", selectedGroup._id);
            } else if (selectedUser) {
                await sendUserMessage(formData);
                if (socket) socket.emit("stopTyping", selectedUser._id);
            }

            setText("");
            removeFile();
            setShowEmojiPicker(false);
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showEmojiPicker && !e.target.closest(".emoji-picker")) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showEmojiPicker]);

    return (
        <div className="p-4 w-full relative">
            {filePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        {fileType === "image" ? (
                            <img
                                src={filePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                            />
                        ) : fileType === "video" ? (
                            <video
                                src={filePreview}
                                className="w-20 h-20 rounded-lg border border-zinc-700"
                                controls
                            />
                        ) : fileType === "audio" ? (
                            <audio controls className="w-full">
                                <source src={filePreview} type={selectedFile.type} />
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <div className="w-20 h-20 flex items-center justify-center rounded-lg border border-zinc-700 bg-gray-800 text-white">
                                <FileText size={30} />
                            </div>
                        )}

                        <button
                            onClick={removeFile}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 flex gap-2 items-center relative">
                    <button
                        type="button"
                        aria-label="Emoji picker"
                        className="btn btn-circle p-2 h-10 w-10 sm:h-12 sm:w-12 text-zinc-400 flex items-center justify-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojiPicker(!showEmojiPicker);
                        }}
                    >
                        <Smile size={20} />
                    </button>

                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-md bg-transparent text-white"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <input
                        type="file"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        aria-label="Attach file"
                        className={`btn btn-circle p-2 h-10 w-10 sm:h-12 sm:w-12 ${
                            filePreview ? "text-emerald-500" : "text-zinc-400"
                        } flex items-center justify-center`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip size={20} />
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-circle p-2 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center"
                >
                    <Send size={20} />
                </button>
            </form>

            {showEmojiPicker && (
                <div
                    className="absolute bottom-16 left-4 z-50 bg-zinc-800 rounded-lg shadow-lg emoji-picker"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
                </div>
            )}
        </div>
    );
};

export default MessageInput;
