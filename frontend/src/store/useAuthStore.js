import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useGroupStore } from "./useGroupStore";

const BASE_URL = "http://localhost:5172/api/";
const SOCKET_URL = "http://localhost:5172";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    friends: [],
    isFetchingFriends: false,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            if (userId) {
                set({ 
                    authUser: {
                        _id: userId,
                        username: localStorage.getItem('username'),
                        email: localStorage.getItem('email'),
                        profileImage: localStorage.getItem('profileImage')
                    }
                });
            }
            const res = await axiosInstance.get("/auth/check");
            set({ 
                authUser: {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    profileImage: res.data.profileImage
                }
            });
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('profileImage', res.data.profileImage || '');
            get().connectSocket();
            
            // ✅ Fetch groups from `useGroupStore.js`
            useGroupStore.getState().fetchGroups();
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('profileImage');
        } finally {
            set({ isCheckingAuth: false });
        }
    },


    signUp: async (data) => {
        set({ isSigningUp: true });

        try {
            await axiosInstance.post("/auth/signup", data);
            
            toast.success("Registration successful. Please login.");


            return { success: true };
        } catch ( error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/auth/login", data);
            // Store user data separately in localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('profileImage', res.data.profileImage || '');

            // Set auth header
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            // Set user in state
            set({ 
                authUser: {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    profileImage: res.data.profileImage,
                    phone: res.data.phone,
                    bannerImage: res.data.bannerImage,
                    bio: res.data.bio
                }
            });

            // Set cookie with token
            document.cookie = `token=${res.data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

            toast.success("Login successful");
            get().connectSocket();
           // ✅ Correct way to call fetchGroups() from useGroupStore
              useGroupStore.getState().fetchGroups();


            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return { success: false, message: error.response?.data?.message || "Login failed" };
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('profileImage');

            // Clear auth header
            delete axiosInstance.defaults.headers.common['Authorization'];

            // Clear cookies
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

            toast("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ 
                authUser: {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    profileImage: res.data.profileImage
                }
            });
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('profileImage', res.data.profileImage || '');

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        
        if (!authUser || get().socket?.connected) return;

        if (get().socket) {
            get().socket.disconnect();
            set({ socket: null });
        }

        const socket = io(SOCKET_URL, {
            query: { userId: authUser._id },
            auth: {
                token: localStorage.getItem('token')
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            transports: ['websocket']
        });

        set({ socket });

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            socket.emit('userOnline', authUser._id);
        };

        const handleConnectError = (err) => {
            console.error("Socket connection error:", err.message);
            socket.disconnect();
            set({ socket: null });
            setTimeout(() => get().connectSocket(), 5000);
        };

        const handleDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
            if (reason === "io server disconnect") {
                setTimeout(() => get().connectSocket(), 1000);
            }
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        socket.connect();
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.removeAllListeners();
            socket.disconnect();
            set({ socket: null });
        }
    },

    fetchFriends: async () => {
        const senderId = localStorage.getItem("userId");
        if (!senderId) {
            console.error("No user ID found");
            return;
        }

        set({ isFetchingFriends: true });
        try {
            const res = await axiosInstance.get(`/user/friends/${senderId}`);
            // Handle both array and object response formats
            if (res.data) {
                const friendsData = Array.isArray(res.data) 
                    ? res.data 
                    : res.data.friends || [];
                set({ friends: friendsData });
            } else {
                console.error("No friends data received");
                set({ friends: [] });
            }


        } catch (error) {
            console.error("Error fetching friends:", error);
            toast.error(error.response?.data?.message || "Failed to fetch friends");
            set({ friends: [] });

        } finally {
            set({ isFetchingFriends: false });
        }
    },

    
}));