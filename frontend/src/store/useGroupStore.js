import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
    messages: [],
    groups: [],
    selectedGroup: null,
    isGroupsLoading: false,
    isMessagesLoading: false,
    currentPage: 1,
    hasMoreMessages: true,
    isFetchingGroups: false,
    typingUsers: {},



    setGroupMessages: (newMessages) => {
        set({ messages: newMessages }); // ✅ Messages overwrite kar raha hai
    },

    fetchGroups: async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("No user ID found");
            return;
        }

        set({ isFetchingGroups: true });
        try {
            const res = await axiosInstance.get(`/groups/my-groups/`);

            console.log("Fetched groups data:", res.data);
            set({ groups: res.data || [] });
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast.error(error.response?.data?.message || "Failed to fetch groups");
            set({ groups: [] });
        } finally {
            set({ isFetchingGroups: false });
        }
    },

    createGroup: async (groupData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const res = await axiosInstance.post("/groups/create", groupData, {
                headers: {
                Authorization: `Bearer ${token}`
            }
            });
            set((state) => ({
                groups: [...state.groups, res.data.group]
            }));
            toast.success("Group created successfully");
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error(error.response?.data?.message || "Failed to create group");
        }
    },


    getMessages: async (groupId, page = 1) => {
        set({ isMessagesLoading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const res = await axiosInstance.get(`/groups/messages/${groupId}`, {
                params: { page },
                headers: {
                    Authorization: `Bearer ${token}`
                }
             });
             const newMessages = res.data;
             console.log("Fetched group messages:", newMessages);
     
             set({
                 messages: newMessages, 
                 currentPage: page,
                 hasMoreMessages: newMessages.length > 0
             });
        } catch (error) {
            toast.error("Failed to load messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (formData) => {
        const { selectedGroup } = get();
        if (!selectedGroup) {
            toast.error("No group selected.");
            return;
        }

        try {
            const res = await axiosInstance.post(`/groups/send/${selectedGroup._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set((state) => ({ messages: [...state.messages, res.data] }));
        } catch (error) {
            toast.error("Failed to send message.");
        }
    },

    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();
        if (!selectedGroup) return;
        
        const { socket, connectSocket } = useAuthStore.getState();
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        if (!socket || !socket.connected) {
            connectSocket();
            return;
        }

        // Clear previous listeners
        socket.off("newGroupMessage");
        socket.off("userTyping");
        socket.off("userStoppedTyping");

        // Message handler
        socket.on("newGroupMessage", (newMessage) => {
            if (newMessage?.groupId === selectedGroup._id) {
                set((state) => ({ messages: [...state.messages, newMessage] }));
            }
        });

        // Typing handlers
        const handleUserTyping = ({ userId, username }) => {
            console.log('Received typing event for user:', userId);
            set((state) => {
                // Only update if this is a new typing user
                if (!state.typingUsers[userId]) {
                    return { 
                        typingUsers: { ...state.typingUsers, [userId]: username }
                    };
                }
                return state;
            });
        };

        const handleUserStoppedTyping = ({ userId }) => {
            console.log('Received stop typing event for user:', userId);
            set((state) => {
                if (state.typingUsers[userId]) {
                    const updated = {...state.typingUsers};
                    delete updated[userId];
                    return { typingUsers: updated };
                }
                return state;
            });
        };

        socket.on("userTyping", handleUserTyping);
        socket.on("userStoppedTyping", handleUserStoppedTyping);

        // Join group room
        socket.emit("joinGroup", { 
            groupId: selectedGroup._id, 
            userId,
            username
        });

        // Return cleanup function
        return () => {
            socket.off("newGroupMessage");
            socket.off("userTyping", handleUserTyping);
            socket.off("userStoppedTyping", handleUserStoppedTyping);
        };
    },
    
    
      unsubscribeFromGroupMessages: () => {
        const { socket } = useAuthStore.getState();
        const { selectedGroup } = get();
        if (socket && selectedGroup) {
          socket.off("newGroupMessage");
          socket.emit("leaveGroup", { groupId: selectedGroup.id, userId: localStorage.getItem("userId") });
        }
      },
    

    setSelectedGroup: (selectedGroup) => set({ selectedGroup })
}));
