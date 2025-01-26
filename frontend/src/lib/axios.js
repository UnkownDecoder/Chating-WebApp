import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5172/api",
    withCredentials: true,
});