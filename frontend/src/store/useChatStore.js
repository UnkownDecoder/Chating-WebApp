import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("http://localhost:5172/api/messages/users");
            set({ users: res.data });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Handle Unauthorized error (maybe redirect to login)
                toast.error('You are not authorized. Please login again.');
            } else {
                toast.error(error.response?.data?.message || 'An error occurred.');
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
    
        try {
            const res = await axiosInstance.get(`/messages/${userId}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            console.log("📥 Messages fetched:", res.data);
    
            // Merge only new messages
            set({ messages: [...new Set([...get().messages, ...res.data])] });
    
        } catch (error) {
            console.error("❌ Fetch Messages Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to load messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    
    
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
    
        if (!selectedUser || !selectedUser._id) {
            toast.error("No recipient selected.");
            return;
        }
    
        const token = localStorage.getItem("token");
    
        if (!token) {
            toast.error("Authentication token missing. Please log in again.");
            return;
        }
    
        // Create a local temporary message (optimistic UI update)
        const tempMessage = {
            _id: Date.now(), // Temporary ID
            senderId: useAuthStore.getState().authUser._id, 
            receiverId: selectedUser._id, 
            text: messageData.text,
            image: messageData.image || null,
            createdAt: new Date().toISOString(),
            status: "sending", // Add a status field
        };
    
        // Update UI before sending request
        set({ messages: [...messages, tempMessage] });
    
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
    
            console.log("✅ Message sent:", res.data);
            set({ 
                messages: [...messages.filter(m => m._id !== tempMessage._id), res.data] 
            });
    
        } catch (error) {
            console.error("❌ Message Send Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to send message.");
    
            // Remove the temp message from UI
            set({ messages: messages.filter(m => m._id !== tempMessage._id) });
        }
    },
    
    

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        if (!socket) return; // Prevent errors if socket is null
    
        // Remove previous listener to prevent duplicates
        socket.off("newMessage"); 
    
        socket.on("newMessage", (newMessage) => {
            console.log("🔄 New message received:", newMessage);
            console.log("📩 Current selected user:", selectedUser);
    
            if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },
    
    

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
    
        console.log("🔄 Unsubscribing from messages...");
    
        // Remove only the specific callback function
        socket.off("newMessage");
    },
    

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
