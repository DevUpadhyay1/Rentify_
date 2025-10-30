import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // your backend API root
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post("http://127.0.0.1:8000/auth/refresh/", {
          refresh,
        });

        localStorage.setItem("token", res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login"; // redirect if refresh fails
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
  refresh: (data) => api.post("/auth/refresh/", data),

  // email verification
  sendVerification: (email) => api.post("/auth/send-verification/", { email }),

  resendVerification: (email) =>
    api.post("/auth/send-verification/", { email }), // same endpoint, just reuse

  checkVerification: (email) =>
    api.post("/auth/check-verification/", { email }),
};

export default api;
