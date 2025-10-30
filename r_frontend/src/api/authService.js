// import axiosInstance from "./axios";

// const authService = {
//   // Register new user
//   register: async (userData) => {
//     const response = await axiosInstance.post("/api/auth/register/", userData);
//     return response.data;
//   },

//   // Login user
//   login: async (credentials) => {
//     const response = await axiosInstance.post("/api/token/", credentials);
//     if (response.data.access) {
//       localStorage.setItem("token", response.data.access);
//       localStorage.setItem("refreshToken", response.data.refresh);
//     }
//     return response.data;
//   },

//   // Logout user
//   logout: async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (refreshToken) {
//         await axiosInstance.post("/api/token/blacklist/", {
//           refresh: refreshToken,
//         });
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("user");
//     }
//   },

//   // Verify email
//   verifyEmail: async (uidb64, token) => {
//     const response = await axiosInstance.get(
//       `/auth/verify-email/${uidb64}/${token}/`
//     );
//     return response.data;
//   },

//   // Resend verification email
//   resendVerification: async (email) => {
//     const response = await axiosInstance.post(
//       "/api/auth/resend-verification/",
//       { email }
//     );
//     return response.data;
//   },

//   // Forgot password
//   forgotPassword: async (email) => {
//     const response = await axiosInstance.post("/api/auth/forgot-password/", {
//       email,
//     });
//     return response.data;
//   },

//   // Reset password
//   resetPassword: async (uidb64, token, newPassword) => {
//     const response = await axiosInstance.post(
//       `/api/auth/reset-password/${uidb64}/${token}/`,
//       {
//         new_password: newPassword,
//       }
//     );
//     return response.data;
//   },

//   // Get current user
//   getCurrentUser: async () => {
//     const response = await axiosInstance.get("/api/users/me/");
//     localStorage.setItem("user", JSON.stringify(response.data));
//     return response.data;
//   },

//   // Update profile
//   updateProfile: async (userData) => {
//     const response = await axiosInstance.put(
//       "/api/auth/user/profile/",
//       userData
//     );
//     localStorage.setItem("user", JSON.stringify(response.data));
//     return response.data;
//   },

//   // Change password
//   changePassword: async (oldPassword, newPassword) => {
//     const response = await axiosInstance.post("/api/auth/change-password/", {
//       old_password: oldPassword,
//       new_password: newPassword,
//     });
//     return response.data;
//   },
// };

// export default authService;
