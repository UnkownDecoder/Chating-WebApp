import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getAllGroupsMessages, getAllMessages } from "../../../backend/controllers/adminController";

const BASE_URL = "http://localhost:5172/api/";
const SOCKET_URL = "http://localhost:5172";

export const adminAuthStore = create((set, get) => ({

    totalUsers:null,
    totalGroups:null,
    userMessages:null,
    groupMessages:null,


    getAllUsers: async () => {
      
        try {
            const res =  await axiosInstance.get("/admin/users");
            set({ totalUsers: res.data.length });
          
          return res;
        } catch ( error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } 
    },
  
    getAllGroups: async () => {
      
        try {
            const res =  await axiosInstance.get("/admin/groups");
            set({ totalGroups: res.data.length });
           
          return res;
        } catch ( error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } 
    },

    getAllMessages: async () => {
      
        try {
            const res =  await axiosInstance.get("/admin/userMessages");
            set({ userMessages: res.data.length });
            userMessages = res.data.length;
          return res;
        } catch ( error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } 
    },
  
    getAllGroupsMessages: async () => {
      
        try {
            const res =  await axiosInstance.get("/admin/groupMessages");
          set({ groupMessages: res.data.length });
            groupMessages = res.data.length;
          return res;
        } catch ( error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } 
    },

}))