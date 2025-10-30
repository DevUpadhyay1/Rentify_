// import React, { useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   MapPin,
//   Star,
//   Heart,
//   ArrowLeft,
//   Calendar,
//   Edit,
//   Trash2,
// } from "lucide-react";
// import {
//   Button,
//   Badge,
//   Card,
//   Loader,
//   Alert,
//   Modal,
//   Avatar,
// } from "../../components/common";
// import { useFetch } from "../../hooks";
// import { useAuthContext } from "../../context";
// import { itemService } from "../../api";
// import { formatCurrency, formatDate } from "../../utils";

// const ItemDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuthContext();

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // Fetch item details
//   const {
//     data: item,
//     loading,
//     error,
//   } = useFetch(() => itemService.getById(id), [id]);

//   const handleDelete = async () => {
//     try {
//       await itemService.delete(id);
//       navigate("/items");
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const handleRent = () => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }
//     // TODO: Navigate to rental booking page
//     navigate(`/items/${id}/rent`);
//   };

//   if (loading) {
//     return (
//       <div className="container-custom py-12">
//         <Loader text="Loading item details..." />
//       </div>
//     );
//   }

//   if (error || !item) {
//     return (
//       <div className="container-custom py-12">
//         <Alert
//           type="error"
//           title="Error loading item"
//           message={error?.message || "Item not found"}
//         />
//         <Link to="/items" className="mt-4 inline-block">
//           <Button variant="outline" icon={<ArrowLeft size={16} />}>
//             Back to Items
//           </Button>
//         </Link>
//       </div>
//     );
//   }

//   const isOwner = user?.id === item.owner?.id;
//   const images = item.images || [];
//   const avgRating = item.average_rating || 0;
//   const reviewCount = item.review_count || 0;

//   return (
//     <div className="container-custom py-6">
//       {/* Back Button */}
//       <Link
//         to="/items"
//         className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
//       >
//         <ArrowLeft size={20} />
//         <span>Back to Items</span>
//       </Link>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Images Section */}
//         <div>
//           {/* Main Image */}
//           <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
//             <img
//               src={images[selectedImage]?.image || "/placeholder-item.jpg"}
//               alt={item.name}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Thumbnail Gallery */}
//           {images.length > 1 && (
//             <div className="grid grid-cols-4 gap-2">
//               {images.map((img, index) => (
//                 <button
//                   key={img.id}
//                   onClick={() => setSelectedImage(index)}
//                   className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
//                     selectedImage === index
//                       ? "border-blue-500 scale-95"
//                       : "border-transparent hover:border-gray-300"
//                   }`}
//                 >
//                   <img
//                     src={img.image}
//                     alt={`${item.name} ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Details Section */}
//         <div>
//           {/* Status & Favorite */}
//           <div className="flex items-center justify-between mb-4">
//             <Badge
//               variant={
//                 item.status === "available"
//                   ? "success"
//                   : item.status === "rented"
//                   ? "warning"
//                   : "gray"
//               }
//             >
//               {item.status}
//             </Badge>

//             <button
//               onClick={() => setIsFavorite(!isFavorite)}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
//             >
//               <Heart
//                 size={24}
//                 className={
//                   isFavorite
//                     ? "fill-red-500 text-red-500"
//                     : "text-gray-600 dark:text-gray-400"
//                 }
//               />
//             </button>
//           </div>

//           {/* Title & Category */}
//           <Badge variant="primary" className="mb-2">
//             {item.category_display || item.category}
//           </Badge>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             {item.name}
//           </h1>

//           {/* Rating */}
//           {reviewCount > 0 && (
//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex items-center gap-1">
//                 <Star size={20} className="fill-yellow-400 text-yellow-400" />
//                 <span className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {avgRating.toFixed(1)}
//                 </span>
//               </div>
//               <span className="text-gray-500 dark:text-gray-400">
//                 ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
//               </span>
//             </div>
//           )}

//           {/* Location */}
//           <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
//             <MapPin size={20} />
//             <span>{item.location}</span>
//           </div>

//           {/* Price */}
//           <Card className="mb-6" padding="md">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                   Price per day
//                 </p>
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {formatCurrency(item.price_per_day)}
//                 </p>
//               </div>

//               {item.status === "available" && (
//                 <Button
//                   size="lg"
//                   onClick={handleRent}
//                   icon={<Calendar size={20} />}
//                 >
//                   Rent Now
//                 </Button>
//               )}
//             </div>
//           </Card>

//           {/* Description */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//               Description
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
//               {item.description}
//             </p>
//           </div>

//           {/* Owner Info */}
//           <Card className="mb-6" padding="md">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//               Owner Information
//             </h3>
//             <div className="flex items-center gap-3">
//               <Avatar
//                 src={item.owner?.avatar}
//                 name={`${item.owner?.first_name} ${item.owner?.last_name}`}
//                 size="lg"
//               />
//               <div>
//                 <p className="font-semibold text-gray-900 dark:text-white">
//                   {item.owner?.first_name} {item.owner?.last_name}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Member since {formatDate(item.owner?.date_joined)}
//                 </p>
//               </div>
//             </div>
//           </Card>

//           {/* Owner Actions */}
//           {isOwner && (
//             <div className="flex gap-3">
//               <Link to={`/items/${id}/edit`} className="flex-1">
//                 <Button variant="outline" fullWidth icon={<Edit size={16} />}>
//                   Edit Item
//                 </Button>
//               </Link>
//               <Button
//                 variant="danger"
//                 onClick={() => setDeleteModalOpen(true)}
//                 icon={<Trash2 size={16} />}
//               >
//                 Delete
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         title="Delete Item"
//         footer={
//           <>
//             <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button variant="danger" onClick={handleDelete}>
//               Delete
//             </Button>
//           </>
//         }
//       >
//         <p className="text-gray-600 dark:text-gray-400">
//           Are you sure you want to delete "{item.name}"? This action cannot be
//           undone.
//         </p>
//       </Modal>
//     </div>
//   );
// };

// export default ItemDetail;
