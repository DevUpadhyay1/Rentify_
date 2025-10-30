// import axiosInstance from './axios';

// const userService = {
//   // Get user profile
//   getProfile: async () => {
//     const response = await axiosInstance.get('/api/auth/user/profile/');
//     return response.data;
//   },

//   // Update profile
//   updateProfile: async (profileData) => {
//     const response = await axiosInstance.put('/api/auth/user/profile/', profileData);
//     return response.data;
//   },

//   // Upload profile picture
//   uploadProfilePicture: async (file) => {
//     const formData = new FormData();
//     formData.append('profile_picture', file);
    
//     const response = await axiosInstance.post('/api/auth/upload-profile-picture/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   },

//   // Get user statistics
//   getUserStats: async () => {
//     const response = await axiosInstance.get('/api/users/stats/');
//     return response.data;
//   },
// };

// export default userService;