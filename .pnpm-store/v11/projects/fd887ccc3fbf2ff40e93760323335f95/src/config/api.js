import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
});

// Clerk owns the browser session. The token is injected just before each private
// Drivea API call, never sourced from a user-controlled ID or local storage.
let accessTokenGetter = null;

export const setAccessTokenGetter = (getter) => {
    accessTokenGetter = getter;
};

api.interceptors.request.use(async (config) => {
    const token = await accessTokenGetter?.();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
