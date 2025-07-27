import axios from "axios";
import {useAuthStore} from "../store/authStore";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token; // ✅ Always gets current token from store
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
