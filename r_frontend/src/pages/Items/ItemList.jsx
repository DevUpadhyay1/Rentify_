// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Loader, EmptyState, Alert } from '../../components/common';
// import { ItemCard, ItemFilters } from '../../components/items';
// import { useFetch } from '../../hooks';
// import { itemService } from '../../api';

// const ItemList = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const [filters, setFilters] = useState({
//     search: searchParams.get('search') || '',
//     category: searchParams.get('category') || '',
//     status: searchParams.get('status') || '',
//     location: searchParams.get('location') || '',
//     min_price: searchParams.get('min_price') || '',
//     max_price: searchParams.get('max_price') || '',
//   });

//   const [favorites, setFavorites] = useState([]);

//   // Fetch items with filters
//   const { data: items, loading, error, refetch } = useFetch(
//     () => itemService.getAll(filters),
//     [filters]
//   );

//   // Update URL params when filters change
//   useEffect(() => {
//     const params = {};
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) params[key] = value;
//     });
//     setSearchParams(params);
//   }, [filters, setSearchParams]);

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       category: '',
//       status: '',
//       location: '',
//       min_price: '',
//       max_price: '',
//     });
//   };

//   const handleFavorite = (itemId) => {
//     setFavorites((prev) =>
//       prev.includes(itemId)
//         ? prev.filter((id) => id !== itemId)
//         : [...prev, itemId]
//     );
//     // TODO: Call API to save favorite
//   };

//   if (error) {
//     return (
//       <div className="container-custom py-12">
//         <Alert
//           type="error"
//           title="Error loading items"
//           message={error.message || 'Failed to load items. Please try again.'}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="container-custom py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           Browse Items
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           {items?.length || 0} items available for rent
//         </p>
//       </div>

//       {/* Filters */}
//       <ItemFilters
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onReset={handleResetFilters}
//       />

//       {/* Loading State */}
//       {loading && (
//         <div className="py-12">
//           <Loader text="Loading items..." />
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && items?.length === 0 && (
//         <EmptyState
//           type="search"
//           actionLabel="Clear Filters"
//           onAction={handleResetFilters}
//         />
//       )}

//       {/* Items Grid */}
//       {!loading && items?.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {items.map((item) => (
//             <ItemCard
//               key={item.id}
//               item={item}
//               onFavorite={handleFavorite}
//               isFavorite={favorites.includes(item.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemList;