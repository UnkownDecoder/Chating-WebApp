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
    groups: [],
    isFetchingGroups: false,



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

    getGroups: async () => {
        try {
            const res = await axiosInstance.get("/groups");
            set({ groups: res.data });
        } catch (error) {
            toast.error("Failed to load groups.");
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
    
        if (socket) {
          socket.off("newGroupMessage");
          socket.on("newGroupMessage", (newMessage) => {
            if (newMessage?.groupId === selectedGroup.id) {
              set((state) => ({ messages: [...state.messages, newMessage] }));
            }
          });
          socket.emit("joinGroup", { groupId: selectedGroup.id, userId: localStorage.getItem("userId") });
        } else {
          connectSocket();
        }
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
