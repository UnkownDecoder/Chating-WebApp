import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, X } from 'lucide-react';
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

    const { sendMessage, selectedUser } = useChatStore();
    const { socket } = useAuthStore();

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
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    useEffect(() => {
        if (!socket || !selectedUser) return;

        const typingTimeout = setTimeout(() => {
            if (isTyping) {
                socket.emit('stopTyping', selectedUser._id);
                setIsTyping(false);
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

            setText("");
            setImagePreview(null);
            setSelectedImage(null);
            setShowEmojiPicker(false);
            if (fileInputRef.current) fileInputRef.current.value = "";

            if (socket && selectedUser) {
                socket.emit('stopTyping', selectedUser._id);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

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

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2 items-center relative">
                    <button
                        type="button"
                        aria-label="Emoji picker"
                        className="flex items-center justify-center btn btn-circle p-1 sm:p-2 h-10 w-10 sm:h-12 sm:w-12 text-zinc-400"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile size={16} className="sm:size-20" />
                    </button>

                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
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
                        aria-label="Attach image"
                        className={`flex items-center justify-center btn btn-circle p-1 sm:p-2 h-10 w-10 sm:h-12 sm:w-12 ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={16} className="sm:size-20" />
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-circle p-1 sm:p-2 h-10 w-10 sm:h-12 sm:w-12"
                >
                    <Send size={16} className="sm:size-22" />
                </button>
            </form>

            {showEmojiPicker && (
                <div className="absolute bottom-16 left-4 z-50 bg-zinc-800 rounded-lg shadow-lg">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
                </div>
            )}
        </div>
    );
};

export default MessageInput;