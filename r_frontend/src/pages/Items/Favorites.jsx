// import React, { useState } from "react";
// import { Heart } from "lucide-react";
// import { Loader, EmptyState, Alert } from "../../components/common";
// import { ItemCard } from "../../components/items";
// import { useFetch } from "../../hooks";
// import { itemService } from "../../api";

// const Favorites = () => {
//   const [favorites, setFavorites] = useState([]);

//   // TODO: Replace with actual favorites API call
//   const {
//     data: items,
//     loading,
//     error,
//   } = useFetch(() => itemService.getAll({ favorite: true }), []);

//   const handleFavorite = (itemId) => {
//     // TODO: Call API to remove from favorites
//     setFavorites((prev) => prev.filter((id) => id !== itemId));
//   };

//   if (error) {
//     return (
//       <div className="container-custom py-12">
//         <Alert
//           type="error"
//           title="Error loading favorites"
//           message={error.message || "Failed to load your favorites"}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="container-custom py-6">
//       <div className="flex items-center gap-3 mb-6">
//         <Heart size={32} className="text-red-500" />
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             My Favorites
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             {items?.length || 0} saved items
//           </p>
//         </div>
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="py-12">
//           <Loader text="Loading favorites..." />
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && items?.length === 0 && (
//         <EmptyState
//           icon={<Heart size={64} />}
//           title="No favorites yet"
//           message="Start adding items to your favorites by clicking the heart icon"
//           actionLabel="Browse Items"
//           onAction={() => (window.location.href = "/items")}
//         />
//       )}

//       {/* Favorites Grid */}
//       {!loading && items?.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {items.map((item) => (
//             <ItemCard
//               key={item.id}
//               item={item}
//               onFavorite={handleFavorite}
//               isFavorite={true}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Favorites;
