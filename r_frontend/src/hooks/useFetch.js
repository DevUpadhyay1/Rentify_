// import { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '../api/axios';

// export const useFetch = (url, options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const {
//     method = 'GET',
//     body = null,
//     dependencies = [],
//     skip = false, // Skip initial fetch
//   } = options;

//   const fetchData = useCallback(async () => {
//     if (skip) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const config = {
//         method,
//         url,
//       };

//       if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
//         config.data = body;
//       }

//       const response = await axiosInstance(config);
//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Something went wrong');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [url, method, body, skip]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData, ...dependencies]);

//   // Refetch function
//   const refetch = useCallback(() => {
//     return fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch };
// };

// // ==================== EXAMPLE USAGE ====================
// /*
// // Get items
// const { data: items, loading, error, refetch } = useFetch('/api/items/');

// // Get single item
// const { data: item } = useFetch(`/api/items/${itemId}/`, {
//   dependencies: [itemId],
// });

// // Skip initial fetch (manual trigger)
// const { refetch: createItem } = useFetch('/api/items/', {
//   method: 'POST',
//   skip: true,
// });

// // Usage in component:
// const handleSubmit = async (formData) => {
//   await createItem({ body: formData });
// };
// */