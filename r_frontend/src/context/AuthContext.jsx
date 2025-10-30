// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import authService from "../api/authService";
// import { storage, toastify } from "../utils";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Check authentication on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       const token = storage.get("token");
//       const storedUser = storage.get("user");

//       if (token && storedUser) {
//         try {
//           // Verify token is still valid by fetching user data
//           const userData = await authService.getCurrentUser();
//           setUser(userData);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("Auth initialization failed:", error);
//           // Clear invalid auth data
//           storage.remove("token");
//           storage.remove("refreshToken");
//           storage.remove("user");
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       const data = await authService.login(credentials);

//       // Get user data after login
//       const userData = await authService.getCurrentUser();
//       setUser(userData);
//       setIsAuthenticated(true);

//       toastify.success(`Welcome back, ${userData.first_name}!`);
//       navigate("/");

//       return { success: true, data: userData };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Login failed. Please try again.";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       const data = await authService.register(userData);
//       toastify.success(
//         "Registration successful! Please check your email to verify your account."
//       );
//       navigate("/verify-email");
//       return { success: true, data };
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "Registration failed. Please try again.";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       setLoading(true);
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       toastify.success("Logged out successfully");
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Force logout even if API call fails
//       storage.remove("token");
//       storage.remove("refreshToken");
//       storage.remove("user");
//       setUser(null);
//       setIsAuthenticated(false);
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update profile function
//   const updateProfile = async (profileData) => {
//     try {
//       setLoading(true);
//       const updatedUser = await authService.updateProfile(profileData);
//       setUser(updatedUser);
//       toastify.success("Profile updated successfully");
//       return { success: true, data: updatedUser };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to update profile";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Change password function
//   const changePassword = async (oldPassword, newPassword) => {
//     try {
//       setLoading(true);
//       await authService.changePassword(oldPassword, newPassword);
//       toastify.success("Password changed successfully");
//       return { success: true };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to change password";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify email function
//   const verifyEmail = async (uidb64, token) => {
//     try {
//       setLoading(true);
//       const data = await authService.verifyEmail(uidb64, token);
//       toastify.success("Email verified successfully! You can now login.");
//       navigate("/login");
//       return { success: true, data };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Email verification failed";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend verification email
//   const resendVerification = async (email) => {
//     try {
//       setLoading(true);
//       await authService.resendVerification(email);
//       toastify.success("Verification email sent! Please check your inbox.");
//       return { success: true };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to send verification email";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Forgot password function
//   const forgotPassword = async (email) => {
//     try {
//       setLoading(true);
//       await authService.forgotPassword(email);
//       toastify.success("Password reset link sent to your email");
//       return { success: true };
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to send reset link";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset password function
//   const resetPassword = async (uidb64, token, newPassword) => {
//     try {
//       setLoading(true);
//       await authService.resetPassword(uidb64, token, newPassword);
//       toastify.success("Password reset successful! You can now login.");
//       navigate("/login");
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || "Password reset failed";
//       toastify.error(message);
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if user has specific role
//   const hasRole = (role) => {
//     return user?.role === role;
//   };

//   // Check if user owns a resource
//   const isOwner = (resourceOwnerId) => {
//     return user?.id === resourceOwnerId;
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword,
//     verifyEmail,
//     resendVerification,
//     forgotPassword,
//     resetPassword,
//     hasRole,
//     isOwner,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use auth context
// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };
