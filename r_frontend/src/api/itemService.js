// import axiosInstance from './axios';

// const itemService = {
//   // Get all items
//   getAllItems: async (params = {}) => {
//     const response = await axiosInstance.get('/api/items/', { params });
//     return response.data;
//   },

//   // Get single item
//   getItem: async (id) => {
//     const response = await axiosInstance.get(`/api/items/${id}/`);
//     return response.data;
//   },

//   // Create new item
//   createItem: async (formData) => {
//     const response = await axiosInstance.post('/api/items/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   },

//   // Update item
//   updateItem: async (id, formData) => {
//     const response = await axiosInstance.put(`/api/items/${id}/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   },

//   // Delete item
//   deleteItem: async (id) => {
//     const response = await axiosInstance.delete(`/api/items/${id}/`);
//     return response.data;
//   },

//   // Get user's items
//   getMyItems: async () => {
//     const response = await axiosInstance.get('/api/items/my-items/');
//     return response.data;
//   },

//   // Search items
//   searchItems: async (query) => {
//     const response = await axiosInstance.get('/api/items/search/', {
//       params: { q: query },
//     });
//     return response.data;
//   },

//   // Get items by category
//   getItemsByCategory: async (category) => {
//     const response = await axiosInstance.get('/api/items/', {
//       params: { category },
//     });
//     return response.data;
//   },

//   // Toggle favorite
//   toggleFavorite: async (itemId) => {
//     const response = await axiosInstance.post(`/api/items/${itemId}/favorite/`);
//     return response.data;
//   },

//   // Get favorites
//   getFavorites: async () => {
//     const response = await axiosInstance.get('/api/items/favorites/');
//     return response.data;
//   },
// };

// export default itemService;