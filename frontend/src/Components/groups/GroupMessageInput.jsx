import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, X, FileText, Music, Video as VideoIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const GroupMessageInput = () => {
    const [text, setText] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [messageType, setMessageType] = useState("text");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);

    const { sendGroupMessage, selectedUser } = useChatStore();

    if (!selectedUser || !selectedUser.members) return null; // Ensure it's a group

    const handleEmojiSelect = (emoji) => {
        setText((prev) => prev + emoji.native);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type.split("/")[0];
        let newMessageType = "document"; // Default type

        if (fileType === "image") newMessageType = "image";
        else if (fileType === "video") newMessageType = "video";
        else if (fileType === "audio") newMessageType = "audio";

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setFilePreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setMessageType(newMessageType);
    };

    const removeFile = () => {
        setFilePreview(null);
        setSelectedFile(null);
        setMessageType("text");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("messageType", messageType);

            if (text.trim()) {
                formData.append("text", text.trim());
            }

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            await sendGroupMessage(formData);

            // Reset fields
            setText("");
            removeFile();
            setShowEmojiPicker(false);
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message. Please try again.");
        }
    };

    // Close Emoji Picker on Outside Click
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
        <h1>hiii</h1>
            {filePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        {messageType === "image" ? (
                            <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                        ) : messageType === "video" ? (
                            <video src={filePreview} className="w-20 h-20 rounded-lg border border-zinc-700" controls />
                        ) : messageType === "audio" ? (
                            <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                                <Music size={20} className="text-blue-400" />
                                <p className="text-sm">Audio file selected</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                                <FileText size={20} className="text-gray-400" />
                                <p className="text-sm">Document selected</p>
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
                        accept="image/*, video/*, audio/*, .pdf, .docx, .txt"
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

export default GroupMessageInput;
