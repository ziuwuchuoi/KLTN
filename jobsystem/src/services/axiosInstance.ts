import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    // withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Wait for token to be set before sending request
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("Token is null, Authorization header not set.");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { logout, token } = useAuthStore.getState();

        const originalRequest = error.config; // Store the original request config

        if (
            originalRequest.url.includes("/signin/candidate") ||
            originalRequest.url.includes("/signin/recruiter") ||
            originalRequest.url.includes("/signin/admin") ||
            originalRequest.url.includes("/refresh")
            // originalRequest.url.includes("/me")
        ) {
            // Do not attempt to refresh token for login requests
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops in case of refresh failure

            try {
                // Attempt to refresh the access token
                // await refreshAccessToken();

                // Get the new token
                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }

                // Retry the original request with the new token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token errors (e.g., logout the user)
                logout();
                return Promise.reject(refreshError);
            }
        }

        // Preserve the original error object
        return Promise.reject(error);
    }
);

export default axiosInstance;
