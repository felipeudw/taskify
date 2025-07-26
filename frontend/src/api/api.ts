import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000", // Change later to your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);
