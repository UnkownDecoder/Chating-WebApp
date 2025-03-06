import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    messageCache: new Map(),
    users: [],
    groups: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    currentPage: 1,
    hasMoreMessages: true,

    setMessages: (newMessages) => {
        set({ messages: newMessages }); // ✅ Messages overwrite kar raha hai
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                useAuthStore.getState().logout();
            } else {
                toast.error(error.response?.data?.message || "An error occurred.");
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

  

    getMessages: async (id, page = 1) => {
        set({ isMessagesLoading: true });
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            const res = await axiosInstance.get(`/messages/${id}`, {
                params: { page },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const newMessages = res.data;
            console.log("Fetched messages:", newMessages);
    
            set({
                messages: newMessages, 
                currentPage: page,
                hasMoreMessages: newMessages.length > 0
            });
    
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                useAuthStore.getState().logout();
            } else {
                console.error("Error fetching messages:", error);
                toast.error(error.response?.data?.message || "Failed to load messages. Please try again.");
            }
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    
    

    sendMessage: async (formData) => {
        const { selectedUser } = get();
        if (!selectedUser) {
            toast.error("No user or group selected.");
            return;
        }
    
        try {
            console.log("Sending message to:", formData);
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            set((state) => ({
                messages: [...state.messages, res.data], // ✅ Fix: Use `res.data` instead of `res.data.data`
            }));
    
        } catch (error) {
            console.error("Send Message Error:", error.response || error);
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    },
    
    

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) {
            console.warn("No user or group selected for message subscription");
            return;
        }
    
        const { socket, connectSocket } = useAuthStore.getState();
    
        if (socket) {
            socket.off("newMessage"); // ✅ Remove previous listeners
        }
    
        const handleNewMessage = (newMessage) => {
            if (!newMessage || (!selectedUser._id && !selectedUser.id)) return;

            // Check if the new message is for the selected user or group
            if (newMessage.senderId._id === selectedUser._id || newMessage.receiverId === selectedUser._id || newMessage.groupId === selectedUser.id) {
                set((state) => ({
                    messages: [...state.messages, newMessage], // Add new message to the array
                }));
            }
        };
        const handleSocketError = (error) => {
            console.error("Socket error:", error);
            setTimeout(() => {
                connectSocket();
                setupSocket();
            }, 5000);
        };
    
        const setupSocket = () => {
            if (!socket || !socket.connected) {
                connectSocket();
                
                socket.once('connect', () => {
                    const roomId = selectedUser._id;
                    socket.emit('joinChat', roomId);
                    socket.on("newMessage", handleNewMessage);
                    socket.on("error", handleSocketError);
                });
            } else {
                socket.on("newMessage", handleNewMessage);
                socket.on("error", handleSocketError);
                const roomId = selectedUser._id;
                socket.emit('joinChat', roomId);
            }
        };
    
        setupSocket();
    
        set({ 
            unsubscribeFromMessages: () => {
                if (socket) {
                    socket.off("newMessage", handleNewMessage);
                    socket.off("error", handleSocketError);
                    const roomId = selectedUser._id;
                    socket.emit('leaveChat', roomId);
                }
            }
        });
    },
    

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.emit('leaveChat', get().selectedUser?._id);
        }
    },

    setSelectedUser: (selectedUser) => {
        const currentSelected = get().selectedUser;
        if (currentSelected?._id === selectedUser?._id) {
            set({ selectedUser: null });
            get().unsubscribeFromMessages();
        } else {
            set({ selectedUser });
            get().subscribeToMessages();
        }
    },
}));
