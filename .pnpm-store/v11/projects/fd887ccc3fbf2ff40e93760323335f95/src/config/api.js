import axios from "axios";

// Vite replaces VITE_* values at build time. Local development may use the
// Express default, but production must explicitly provide its deployed API.
const apiBaseUrl = import.meta.env.VITE_BASE_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");

if (!apiBaseUrl) {
    throw new Error("Missing VITE_BASE_URL. Configure the deployed Drivea API URL before building for production.");
}

const api = axios.create({
    baseURL: apiBaseUrl,
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
