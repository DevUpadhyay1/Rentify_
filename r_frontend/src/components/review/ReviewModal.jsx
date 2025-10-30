import React, { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import reviewService from "../../api/reviewService";

export default function ReviewModal({
  isOpen,
  onClose,
  itemId,
  ownerId,
  bookingId,
  needsItemReview,
  needsOwnerReview,
}) {
  const [activeTab, setActiveTab] = useState(
    needsItemReview ? "item" : "owner"
  );
  const [loading, setLoading] = useState(false);

  // Item Review State
  const [itemReview, setItemReview] = useState({
    overall_rating: 0,
    condition_rating: 0,
    accuracy_rating: 0,
    value_rating: 0,
    title: "",
    comment: "",
    pros: "",
    cons: "",
    would_recommend: true,
  });

  // Owner Review State
  const [ownerReview, setOwnerReview] = useState({
    overall_rating: 0,
    communication_rating: 0,
    responsiveness_rating: 0,
    friendliness_rating: 0,
    title: "",
    comment: "",
    would_rent_again: true,
  });

  const handleStarClick = (type, rating, field = "overall_rating") => {
    if (type === "item") {
      setItemReview({ ...itemReview, [field]: rating });
    } else {
      setOwnerReview({ ...ownerReview, [field]: rating });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promises = [];

      // Submit Item Review
      if (activeTab === "item" && needsItemReview) {
        if (itemReview.overall_rating === 0) {
          toast.error("Please provide an overall rating for the item");
          setLoading(false);
          return;
        }

        promises.push(
          reviewService.createItemReview({
            ...itemReview,
            item: itemId,
            booking: bookingId,
          })
        );
      }

      // Submit Owner Review
      if (activeTab === "owner" && needsOwnerReview) {
        if (ownerReview.overall_rating === 0) {
          toast.error("Please provide an overall rating for the owner");
          setLoading(false);
          return;
        }

        promises.push(
          reviewService.createOwnerReview({
            ...ownerReview,
            owner: ownerId,
            booking: bookingId,
          })
        );
      }

      await Promise.all(promises);
      toast.success(
        `${activeTab === "item" ? "Item" : "Owner"} review submitted successfully!`
      );
      onClose(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.response?.data?.error || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, type, field = "overall_rating") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(type, star, field)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Write Review</h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        {needsItemReview && needsOwnerReview && (
          <div className="px-6 pt-4">
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("item")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "item"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Review Item
              </button>
              <button
                onClick={() => setActiveTab("owner")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "owner"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Review Owner
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ITEM REVIEW FORM */}
          {activeTab === "item" && needsItemReview && (
            <>
              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                {renderStars(itemReview.overall_rating, "item")}
              </div>

              {/* Detailed Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  {renderStars(
                    itemReview.condition_rating,
                    "item",
                    "condition_rating"
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Accuracy
                  </label>
                  {renderStars(
                    itemReview.accuracy_rating,
                    "item",
                    "accuracy_rating"
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  {renderStars(
                    itemReview.value_rating,
                    "item",
                    "value_rating"
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={itemReview.title}
                  onChange={(e) =>
                    setItemReview({ ...itemReview, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={itemReview.comment}
                  onChange={(e) =>
                    setItemReview({ ...itemReview, comment: e.target.value })
                  }
                  placeholder="Share your experience with this item..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros (Optional)
                </label>
                <textarea
                  value={itemReview.pros}
                  onChange={(e) =>
                    setItemReview({ ...itemReview, pros: e.target.value })
                  }
                  placeholder="What did you like?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons (Optional)
                </label>
                <textarea
                  value={itemReview.cons}
                  onChange={(e) =>
                    setItemReview({ ...itemReview, cons: e.target.value })
                  }
                  placeholder="What could be improved?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Would Recommend */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={itemReview.would_recommend}
                  onChange={(e) =>
                    setItemReview({
                      ...itemReview,
                      would_recommend: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="recommend" className="text-sm text-gray-700">
                  I would recommend this item
                </label>
              </div>
            </>
          )}

          {/* OWNER REVIEW FORM */}
          {activeTab === "owner" && needsOwnerReview && (
            <>
              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                {renderStars(ownerReview.overall_rating, "owner")}
              </div>

              {/* Detailed Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Communication
                  </label>
                  {renderStars(
                    ownerReview.communication_rating,
                    "owner",
                    "communication_rating"
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Responsiveness
                  </label>
                  {renderStars(
                    ownerReview.responsiveness_rating,
                    "owner",
                    "responsiveness_rating"
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Friendliness
                  </label>
                  {renderStars(
                    ownerReview.friendliness_rating,
                    "owner",
                    "friendliness_rating"
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={ownerReview.title}
                  onChange={(e) =>
                    setOwnerReview({ ...ownerReview, title: e.target.value })
                  }
                  placeholder="Summarize your experience with the owner"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={ownerReview.comment}
                  onChange={(e) =>
                    setOwnerReview({ ...ownerReview, comment: e.target.value })
                  }
                  placeholder="Share your experience with the owner..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Would Rent Again */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rent-again"
                  checked={ownerReview.would_rent_again}
                  onChange={(e) =>
                    setOwnerReview({
                      ...ownerReview,
                      would_rent_again: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="rent-again" className="text-sm text-gray-700">
                  I would rent from this owner again
                </label>
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { Star, Image as ImageIcon, X } from "lucide-react";
// import { Modal, Button, Textarea, Alert } from "../common";
// import StarRating from "./StarRating";

// const ReviewModal = ({ isOpen, onClose, item, onSubmit }) => {
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [images, setImages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
//   };

//   const removeImage = (index) => {
//     setImages((prev) => {
//       const updated = [...prev];
//       URL.revokeObjectURL(updated[index].preview);
//       updated.splice(index, 1);
//       return updated;
//     });
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (rating === 0) {
//       newErrors.rating = "Please select a rating";
//     }

//     if (!comment?.trim()) {
//       newErrors.comment = "Please write a review";
//     } else if (comment.trim().length < 10) {
//       newErrors.comment = "Review must be at least 10 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("rating", rating);
//       formData.append("comment", comment);

//       images.forEach((img) => {
//         formData.append("images", img.file);
//       });

//       await onSubmit(formData);

//       // Reset form
//       setRating(0);
//       setComment("");
//       setImages([]);
//       setErrors({});
//       onClose();
//     } catch (err) {
//       setErrors({ submit: "Failed to submit review. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setRating(0);
//     setComment("");
//     setImages([]);
//     setErrors({});
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={handleClose}
//       title="Write a Review"
//       size="lg"
//     >
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Item Info */}
//         {item && (
//           <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <img
//               src={item.images?.[0]?.image || "/placeholder-item.jpg"}
//               alt={item.name}
//               className="w-20 h-20 object-cover rounded-lg"
//             />
//             <div>
//               <h3 className="font-semibold text-gray-900 dark:text-white">
//                 {item.name}
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {item.category_display}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {errors.submit && (
//           <Alert
//             type="error"
//             message={errors.submit}
//             dismissible
//             onClose={() => setErrors({})}
//           />
//         )}

//         {/* Rating */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Your Rating *
//           </label>
//           <StarRating
//             rating={rating}
//             onChange={setRating}
//             size={32}
//             showLabel
//           />
//           {errors.rating && (
//             <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
//           )}
//         </div>

//         {/* Comment */}
//         <div>
//           <Textarea
//             label="Your Review *"
//             value={comment}
//             onChange={(e) => {
//               setComment(e.target.value);
//               if (errors.comment)
//                 setErrors((prev) => ({ ...prev, comment: "" }));
//             }}
//             placeholder="Share your experience with this rental..."
//             rows={6}
//             maxLength={1000}
//             showCount
//             error={errors.comment}
//             helperText="Help others by sharing your honest feedback"
//             required
//             fullWidth
//           />
//         </div>

//         {/* Images Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Add Photos (Optional)
//           </label>

//           {/* Image Previews */}
//           {images.length > 0 && (
//             <div className="grid grid-cols-5 gap-2 mb-3">
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
//                     className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Upload Button */}
//           {images.length < 5 && (
//             <label className="block">
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
//                 <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
//                   Click to upload photos
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-500">
//                   PNG, JPG up to 5MB each (max 5 photos)
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
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleClose}
//             disabled={loading}
//             fullWidth
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             loading={loading}
//             disabled={loading}
//             icon={<Star size={18} />}
//             fullWidth
//           >
//             Submit Review
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

