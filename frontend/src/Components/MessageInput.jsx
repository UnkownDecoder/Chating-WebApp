import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';


const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);

    const { sendMessage, selectedUser } = useChatStore();
    const { socket } = useAuthStore();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        // Check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
    
        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }
    
        setImagePreview(URL.createObjectURL(file));
        setSelectedImage(file); // ✅ Ensure this is set properly
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
    
            // 🚀 Debugging: Log FormData contents
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]); // Should show 'text' and 'file' keys
            }
    
            await sendMessage(formData);
    
            setText("");
            setImagePreview(null);
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
    
            if (socket && selectedUser) {
                socket.emit('stopTyping', selectedUser._id);
            }
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };
    
    

    const handleInputChange = (e) => {
        const value = e.target.value;
        setText(value);
        
        if (!isTyping && value && socket && selectedUser) {
            socket.emit('typing', selectedUser._id);
            setIsTyping(true);
        }
    };


    return (
        <div className="p-4 w-full">
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
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={handleInputChange}

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
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
