// lib/axios.js

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5172/api', // Adjust this as per your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Add token in Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
