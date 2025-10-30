// import { useState, useEffect } from 'react';

// export const useDebounce = (value, delay = 500) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     // Set timeout to update debounced value
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     // Cleanup timeout if value changes before delay
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };

// // ==================== EXAMPLE USAGE ====================
// /*
// // Search input with debounce
// const SearchComponent = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);

//   useEffect(() => {
//     if (debouncedSearchTerm) {
//       // API call only happens after user stops typing for 500ms
//       searchItems(debouncedSearchTerm);
//     }
//   }, [debouncedSearchTerm]);

//   return (
//     <input
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       placeholder="Search items..."
//     />
//   );
// };
// */