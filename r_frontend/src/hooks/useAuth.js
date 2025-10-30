// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import authService from "../api/authService";
// import { toast } from "react-toastify";

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");

//       if (token && storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//           setIsAuthenticated(true);

//           // Optionally refresh user data from server
//           const userData = await authService.getCurrentUser();
//           setUser(userData);
//         } catch (error) {
//           console.error("Auth check failed:", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("refreshToken");
//           localStorage.removeItem("user");
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Login function
//   const login = useCallback(
//     async (credentials) => {
//       try {
//         setLoading(true);
//         const data = await authService.login(credentials);

//         // Get user data
//         const userData = await authService.getCurrentUser();
//         setUser(userData);
//         setIsAuthenticated(true);

//         toast.success("Login successful!");
//         navigate("/");
//         return { success: true, data };
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Login failed");
//         return { success: false, error };
//       } finally {
//         setLoading(false);
//       }
//     },
//     [navigate]
//   );

//   // Register function
//   const register = useCallback(
//     async (userData) => {
//       try {
//         setLoading(true);
//         const data = await authService.register(userData);
//         toast.success("Registration successful! Please verify your email.");
//         navigate("/verify-email");
//         return { success: true, data };
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Registration failed");
//         return { success: false, error };
//       } finally {
//         setLoading(false);
//       }
//     },
//     [navigate]
//   );

//   // Logout function
//   const logout = useCallback(async () => {
//     try {
//       setLoading(true);
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       toast.success("Logged out successfully");
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   // Update user profile
//   const updateProfile = useCallback(async (profileData) => {
//     try {
//       setLoading(true);
//       const updatedUser = await authService.updateProfile(profileData);
//       setUser(updatedUser);
//       toast.success("Profile updated successfully");
//       return { success: true, data: updatedUser };
//     } catch (error) {
//       toast.error("Failed to update profile");
//       return { success: false, error };
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Check if user has specific role
//   const hasRole = useCallback(
//     (role) => {
//       return user?.role === role;
//     },
//     [user]
//   );

//   return {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//     updateProfile,
//     hasRole,
//   };
// };
