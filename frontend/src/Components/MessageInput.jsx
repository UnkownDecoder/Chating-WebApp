import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);

    const { sendMessage, selectedUser, socket } = useChatStore();
    const { authUser } = useAuthStore();  // Assuming you might want to access current user info.

    const handleEmojiSelect = (emoji) => {
        setText((prev) => prev + emoji.native);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setImagePreview(URL.createObjectURL(file));
        setSelectedImage(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Typing Indicator Logic
    useEffect(() => {
        if (!socket || !selectedUser) return;
        
        const typingTimeout = setTimeout(() => {
            if (text.trim().length) {
                if (!isTyping) {
                    socket.emit('startTyping', selectedUser._id);
                    setIsTyping(true);
                }
            } else {
                if (isTyping) {
                    socket.emit('stopTyping', selectedUser._id);
                    setIsTyping(false);
                }
            }
        }, 1000);

        return () => clearTimeout(typingTimeout);
    }, [text, isTyping, socket, selectedUser]); 

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !selectedImage) return;

        try {
            const formData = new FormData();

            if (text.trim()) {
                formData.append("text", text.trim());
            }

            if (selectedImage) {
                formData.append("file", selectedImage);
            }
   
            await sendMessage(formData);

            // Reset fields
            setText("");
            removeImage();
            setShowEmojiPicker(false);

            if (socket && selectedUser) {
                socket.emit('stopTyping', selectedUser._id);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    // Close Emoji Picker on Outside Click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showEmojiPicker && !e.target.closest('.emoji-picker')) {
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
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img 
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
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
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        aria-label="Attach file"
                        className={`btn btn-circle p-2 h-10 w-10 sm:h-12 sm:w-12 ${imagePreview ? "text-emerald-500" : "text-zinc-400"} flex items-center justify-center`}
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