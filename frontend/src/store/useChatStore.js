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
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                useAuthStore.getState().logout();  // Logout user on 401
            } else {
                toast.error(error.response?.data?.message || "An error occurred.");
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                useAuthStore.getState().logout();
            } else {
                toast.error(error.response?.data?.message || "An error occurred.");
            }
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
            toast.error("No user selected.");
            return;
        }

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message.");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.warn("Socket is not connected.");
            return;
        }

        const handleNewMessage = (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;

            set({
                messages: [...get().messages, newMessage],
            });
        };

        socket.on("newMessage", handleNewMessage);

        // Store reference to the handler for cleanup
        set({ unsubscribeFromMessages: () => socket.off("newMessage", handleNewMessage) });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
