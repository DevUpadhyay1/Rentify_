// import axiosInstance from './axios';

// const orderService = {
//   // Create rental order
//   createOrder: async (orderData) => {
//     const response = await axiosInstance.post('/api/rentals/', orderData);
//     return response.data;
//   },

//   // Get all orders
//   getOrders: async () => {
//     const response = await axiosInstance.get('/api/rentals/');
//     return response.data;
//   },

//   // Get single order
//   getOrder: async (id) => {
//     const response = await axiosInstance.get(`/api/rentals/${id}/`);
//     return response.data;
//   },

//   // Update order status
//   updateOrderStatus: async (id, status) => {
//     const response = await axiosInstance.patch(`/api/rentals/${id}/`, { status });
//     return response.data;
//   },

//   // Cancel order
//   cancelOrder: async (id) => {
//     const response = await axiosInstance.post(`/api/rentals/${id}/cancel/`);
//     return response.data;
//   },

//   // Get orders as owner (items you're renting out)
//   getOrdersAsOwner: async () => {
//     const response = await axiosInstance.get('/api/rentals/owner/');
//     return response.data;
//   },

//   // Get orders as renter (items you're renting)
//   getOrdersAsRenter: async () => {
//     const response = await axiosInstance.get('/api/rentals/renter/');
//     return response.data;
//   },
// };

// export default orderService;