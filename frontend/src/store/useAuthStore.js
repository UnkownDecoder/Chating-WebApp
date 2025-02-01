import {create} from "zustand";
import axiosInstance from  "../lib/axios";
import { io } from "socket.io-client";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import { login, logout, updateProfile } from "../../../backend/controllers/authController";
import { connect, disconnect, get } from "mongoose";

const BASE_URL = "http://localhost:5172";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSiginingUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers : [],
    socket:null,
    

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("http://localhost:5172/auth/check");

            set({ authUser: res.data});
            get().connectSocket();

        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSiginingUp: true });

        try {
           const res = await axiosInstance.post("/auth/signup", data);
           toast.success("Registration done successfully. Please login.");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSiginingUp: false });
        }


    },  

    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({ authUser: res.data });
            toast.success("Login successful");
            
            get().connectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
                } finally {
                    set({ isLoggingIng : false });
                    }
                },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out sucessfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile : async (data) => {
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.id,
            },
        });
        socket.connect()

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds)=> {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
        // Connect to the socket serve
}));