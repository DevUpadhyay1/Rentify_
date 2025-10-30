// import React from "react";
// import { Link } from "react-router-dom";
// import { MapPin, Star, Heart } from "lucide-react";
// import { Card, Badge, Button } from "../common";
// import { formatCurrency } from "../../utils";

// const ItemCard = ({ item, onFavorite, isFavorite = false }) => {
//   const primaryImage = item.images?.[0]?.image || "/placeholder-item.jpg";
//   const avgRating = item.average_rating || 0;
//   const reviewCount = item.review_count || 0;

//   return (
//     <Card hover className="group relative overflow-hidden">
//       {/* Image */}
//       <Link to={`/items/${item.id}`}>
//         <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
//           <img
//             src={primaryImage}
//             alt={item.name}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//             loading="lazy"
//           />

//           {/* Favorite Button */}
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               onFavorite?.(item.id);
//             }}
//             className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
//           >
//             <Heart
//               size={18}
//               className={
//                 isFavorite
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-600 dark:text-gray-400"
//               }
//             />
//           </button>

//           {/* Status Badge */}
//           <div className="absolute top-3 left-3">
//             <Badge
//               variant={
//                 item.status === "available"
//                   ? "success"
//                   : item.status === "rented"
//                   ? "warning"
//                   : "gray"
//               }
//               size="sm"
//             >
//               {item.status}
//             </Badge>
//           </div>
//         </div>
//       </Link>

//       {/* Content */}
//       <div className="p-4">
//         {/* Category */}
//         <div className="flex items-center gap-2 mb-2">
//           <Badge variant="primary" size="sm">
//             {item.category_display || item.category}
//           </Badge>
//         </div>

//         {/* Title */}
//         <Link to={`/items/${item.id}`}>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
//             {item.name}
//           </h3>
//         </Link>

//         {/* Description */}
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//           {item.description}
//         </p>

//         {/* Location */}
//         <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
//           <MapPin size={14} />
//           <span className="line-clamp-1">{item.location}</span>
//         </div>

//         {/* Rating */}
//         {reviewCount > 0 && (
//           <div className="flex items-center gap-1 mb-3">
//             <Star size={14} className="fill-yellow-400 text-yellow-400" />
//             <span className="text-sm font-medium text-gray-900 dark:text-white">
//               {avgRating.toFixed(1)}
//             </span>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
//             </span>
//           </div>
//         )}

//         {/* Price & Action */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
//           <div>
//             <span className="text-2xl font-bold text-gray-900 dark:text-white">
//               {formatCurrency(item.price_per_day)}
//             </span>
//             <span className="text-sm text-gray-500 dark:text-gray-400">
//               /day
//             </span>
//           </div>

//           <Link to={`/items/${item.id}`}>
//             <Button size="sm" variant="primary">
//               View Details
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ItemCard;
