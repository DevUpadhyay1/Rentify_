// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload, X } from "lucide-react";
// import {
//   Button,
//   Input,
//   Select,
//   Textarea,
//   Card,
//   Alert,
// } from "../../components/common";
// import { useAuthContext } from "../../context";
// import { itemService } from "../../api";
// import { CATEGORIES } from "../../utils/constants";

// const AddItem = () => {
//   const navigate = useNavigate();
//   const { user } = useAuthContext();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     price_per_day: "",
//     location: "",
//   });

//   const [images, setImages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newImages]);
//   };

//   const removeImage = (index) => {
//     setImages((prev) => {
//       const newImages = [...prev];
//       URL.revokeObjectURL(newImages[index].preview);
//       newImages.splice(index, 1);
//       return newImages;
//     });
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
//     if (images.length === 0)
//       newErrors.images = "At least one image is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");

//     if (!validate()) return;

//     try {
//       setLoading(true);

//       // Create FormData
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       // Add images
//       images.forEach((img) => {
//         formDataToSend.append("images", img.file);
//       });

//       const newItem = await itemService.create(formDataToSend);
//       navigate(`/items/${newItem.id}`);
//     } catch (err) {
//       setApiError(
//         err.response?.data?.message ||
//           "Failed to create item. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-custom max-w-4xl py-6">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//         Add New Item
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
//               placeholder="e.g., Canon EOS 5D Mark IV"
//               error={errors.name}
//               required
//               fullWidth
//             />

//             <Textarea
//               label="Description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe your item in detail..."
//               rows={5}
//               maxLength={1000}
//               showCount
//               error={errors.description}
//               required
//               fullWidth
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
//                 placeholder="0.00"
//                 error={errors.price_per_day}
//                 required
//                 fullWidth
//               />
//             </div>

//             <Input
//               label="Location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="e.g., Mumbai, Maharashtra"
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

//           {/* Image Upload */}
//           <div className="mb-4">
//             <label className="block w-full">
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
//                 <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                 <p className="text-gray-600 dark:text-gray-400 mb-1">
//                   Click to upload images
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-500">
//                   PNG, JPG up to 5MB each
//                 </p>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//             {errors.images && (
//               <p className="mt-2 text-sm text-red-500">{errors.images}</p>
//             )}
//           </div>

//           {/* Image Previews */}
//           {images.length > 0 && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {images.map((img, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={img.preview}
//                     alt={`Preview ${index + 1}`}
//                     className="w-full aspect-square object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         <div className="flex gap-3">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate("/items")}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" loading={loading} disabled={loading}>
//             Add Item
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddItem;
