import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import { data } from "react-router-dom";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSiginingUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data});
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
}));