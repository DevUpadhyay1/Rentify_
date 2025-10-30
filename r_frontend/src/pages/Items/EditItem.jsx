// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Upload, X } from "lucide-react";
// import {
//   Button,
//   Input,
//   Select,
//   Textarea,
//   Card,
//   Alert,
//   Loader,
// } from "../../components/common";
// import { useAuthContext } from "../../context";
// import { useFetch } from "../../hooks";
// import { itemService } from "../../api";
// import { CATEGORIES } from "../../utils/constants";

// const EditItem = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthContext();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     price_per_day: "",
//     location: "",
//     status: "available",
//   });

//   const [existingImages, setExistingImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);
//   const [imagesToDelete, setImagesToDelete] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   // Fetch item data
//   const {
//     data: item,
//     loading: fetchLoading,
//     error: fetchError,
//   } = useFetch(() => itemService.getById(id), [id]);

//   // Populate form with existing data
//   useEffect(() => {
//     if (item) {
//       setFormData({
//         name: item.name,
//         description: item.description,
//         category: item.category,
//         price_per_day: item.price_per_day,
//         location: item.location,
//         status: item.status,
//       });
//       setExistingImages(item.images || []);
//     }
//   }, [item]);

//   // Check if user is owner
//   useEffect(() => {
//     if (item && user && item.owner?.id !== user.id) {
//       navigate(`/items/${id}`);
//     }
//   }, [item, user, id, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleNewImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const images = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setNewImages((prev) => [...prev, ...images]);
//   };

//   const removeNewImage = (index) => {
//     setNewImages((prev) => {
//       const updated = [...prev];
//       URL.revokeObjectURL(updated[index].preview);
//       updated.splice(index, 1);
//       return updated;
//     });
//   };

//   const removeExistingImage = (imageId) => {
//     setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
//     setImagesToDelete((prev) => [...prev, imageId]);
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name?.trim()) newErrors.name = "Item name is required";
//     if (!formData.description?.trim())
//       newErrors.description = "Description is required";
//     if (!formData.category) newErrors.category = "Category is required";
//     if (!formData.price_per_day) {
//       newErrors.price_per_day = "Price is required";
//     } else if (parseFloat(formData.price_per_day) <= 0) {
//       newErrors.price_per_day = "Price must be greater than 0";
//     }
//     if (!formData.location?.trim()) newErrors.location = "Location is required";

//     if (existingImages.length === 0 && newImages.length === 0) {
//       newErrors.images = "At least one image is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       // Add new images
//       newImages.forEach((img) => {
//         formDataToSend.append("new_images", img.file);
//       });

//       // Add images to delete
//       if (imagesToDelete.length > 0) {
//         formDataToSend.append("delete_images", JSON.stringify(imagesToDelete));
//       }

//       await itemService.update(id, formDataToSend);
//       navigate(`/items/${id}`);
//     } catch (err) {
//       setApiError(
//         err.response?.data?.message ||
//           "Failed to update item. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <div className="container-custom py-12">
//         <Loader text="Loading item..." />
//       </div>
//     );
//   }

//   if (fetchError || !item) {
//     return (
//       <div className="container-custom py-12">
//         <Alert
//           type="error"
//           title="Error"
//           message="Failed to load item details"
//         />
//       </div>
//     );
//   }

//   const STATUS_OPTIONS = [
//     { value: "available", label: "Available" },
//     { value: "rented", label: "Rented" },
//     { value: "maintenance", label: "Under Maintenance" },
//   ];

//   return (
//     <div className="container-custom max-w-4xl py-6">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//         Edit Item
//       </h1>

//       {apiError && (
//         <Alert
//           type="error"
//           message={apiError}
//           dismissible
//           onClose={() => setApiError("")}
//           className="mb-6"
//         />
//       )}

//       <form onSubmit={handleSubmit}>
//         <Card className="mb-6" padding="lg">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Basic Information
//           </h2>

//           <div className="space-y-4">
//             <Input
//               label="Item Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               error={errors.name}
//               required
//               fullWidth
//             />

//             <Textarea
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={5}
//               maxLength={1000}
//               showCount
//               error={errors.description}
//               required
//               fullWidth
//             />

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Select
//                 label="Category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 options={CATEGORIES}
//                 error={errors.category}
//                 required
//                 fullWidth
//               />

//               <Input
//                 label="Price per Day"
//                 type="number"
//                 name="price_per_day"
//                 value={formData.price_per_day}
//                 onChange={handleChange}
//                 error={errors.price_per_day}
//                 required
//                 fullWidth
//               />

//               <Select
//                 label="Status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 options={STATUS_OPTIONS}
//                 required
//                 fullWidth
//               />
//             </div>

//             <Input
//               label="Location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               error={errors.location}
//               required
//               fullWidth
//             />
//           </div>
//         </Card>

//         <Card className="mb-6" padding="lg">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Images
//           </h2>

//           {/* Existing Images */}
//           {existingImages.length > 0 && (
//             <div className="mb-6">
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                 Current Images
//               </p>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {existingImages.map((img) => (
//                   <div key={img.id} className="relative group">
//                     <img
//                       src={img.image}
//                       alt="Item"
//                       className="w-full aspect-square object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeExistingImage(img.id)}
//                       className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* New Images Upload */}
//           <div className="mb-4">
//             <label className="block w-full">
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
//                 <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                 <p className="text-gray-600 dark:text-gray-400 mb-1">
//                   Add more images
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-500">
//                   PNG, JPG up to 5MB each
//                 </p>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleNewImageChange}
//                 className="hidden"
//               />
//             </label>
//             {errors.images && (
//               <p className="mt-2 text-sm text-red-500">{errors.images}</p>
//             )}
//           </div>

//           {/* New Image Previews */}
//           {newImages.length > 0 && (
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                 New Images
//               </p>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {newImages.map((img, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={img.preview}
//                       alt={`New ${index + 1}`}
//                       className="w-full aspect-square object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeNewImage(index)}
//                       className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </Card>

//         <div className="flex gap-3">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate(`/items/${id}`)}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading} disabled={loading}>
//             Save Changes
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditItem;
