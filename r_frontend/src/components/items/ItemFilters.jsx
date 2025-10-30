// import React from "react";
// import { Search, Filter, X } from "lucide-react";
// import { Input, Select, Button, Card } from "../common";
// import { CATEGORIES, ITEM_STATUS } from "../../utils/constants";

// const ItemFilters = ({ filters, onFilterChange, onReset }) => {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onFilterChange({ ...filters, [name]: value });
//   };

//   const hasActiveFilters = Object.values(filters).some(
//     (val) => val !== "" && val !== undefined
//   );

//   return (
//     <Card className="mb-6" padding="md">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <Filter size={20} className="text-gray-600 dark:text-gray-400" />
//           <h3 className="font-semibold text-gray-900 dark:text-white">
//             Filters
//           </h3>
//         </div>

//         {hasActiveFilters && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onReset}
//             icon={<X size={16} />}
//           >
//             Clear All
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Search */}
//         <Input
//           name="search"
//           placeholder="Search items..."
//           value={filters.search || ""}
//           onChange={handleChange}
//           icon={<Search size={16} />}
//           fullWidth
//         />

//         {/* Category */}
//         <Select
//           name="category"
//           placeholder="All Categories"
//           value={filters.category || ""}
//           onChange={handleChange}
//           options={CATEGORIES}
//           fullWidth
//         />

//         {/* Status */}
//         <Select
//           name="status"
//           placeholder="All Status"
//           value={filters.status || ""}
//           onChange={handleChange}
//           options={ITEM_STATUS}
//           fullWidth
//         />

//         {/* Location */}
//         <Input
//           name="location"
//           placeholder="Location..."
//           value={filters.location || ""}
//           onChange={handleChange}
//           icon={<MapPin size={16} />}
//           fullWidth
//         />

//         {/* Price Range */}
//         <div className="col-span-full grid grid-cols-2 gap-4">
//           <Input
//             name="min_price"
//             type="number"
//             placeholder="Min Price"
//             value={filters.min_price || ""}
//             onChange={handleChange}
//             fullWidth
//           />
//           <Input
//             name="max_price"
//             type="number"
//             placeholder="Max Price"
//             value={filters.max_price || ""}
//             onChange={handleChange}
//             fullWidth
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ItemFilters;
