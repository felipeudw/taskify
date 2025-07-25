import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000", // Change later to your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add interceptors if you want auth token support later
api.interceptors.request.use(
    (config) => {
        // Example: attach token
        // const token = localStorage.getItem("auth_token");
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);
