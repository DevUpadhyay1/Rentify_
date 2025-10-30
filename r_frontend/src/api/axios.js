import axios from "axios";
import { toast } from "react-toastify";

// Base URL with /api prefix to match your backend
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token using the correct endpoint
        const refreshToken =
          localStorage.getItem("refresh") ||
          localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Use /api/token/refresh/ as per your backend
          const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("token", access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Don't show toast for certain status codes or paths
    const skipToast =
      originalRequest.url?.includes("pending") ||
      originalRequest.url?.includes("my-reviews");

    if (!skipToast) {
      if (error.response?.status === 403) {
        toast.error("You do not have permission to perform this action");
      } else if (error.response?.status === 404) {
        toast.error("Resource not found");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response?.status === 400) {
        // Handle validation errors
        if (error.response?.data) {
          const errors = error.response.data;
          if (typeof errors === "object" && !errors.detail && !errors.message) {
            // Multiple field errors
            Object.keys(errors).forEach((field) => {
              const fieldErrors = errors[field];
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((err) => toast.error(`${field}: ${err}`));
              } else {
                toast.error(`${field}: ${fieldErrors}`);
              }
            });
          } else {
            toast.error(message);
          }
        }
      } else {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
