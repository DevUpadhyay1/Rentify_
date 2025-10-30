import React, { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import StarRating from "./StarRating";
import reviewService from "../../api/reviewService";
import { toast } from "react-toastify";

export default function ReviewCard({
  review,
  reviewType,
  onUpdate,
  onDelete,
  currentUserId,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHelpful, setIsHelpful] = useState(review.is_helpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [showResponse, setShowResponse] = useState(false);

  const isOwner = review.reviewer?.id === parseInt(currentUserId);

  const handleToggleHelpful = async () => {
    try {
      const response = await reviewService.toggleHelpful(reviewType, review.id);
      setIsHelpful(response.data.is_helpful);
      setHelpfulCount((prev) =>
        response.data.is_helpful ? prev + 1 : prev - 1
      );
    } catch (error) {
      console.error("Error toggling helpful:", error);
      toast.error("Failed to update helpful status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await onDelete(review.id);
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {review.reviewer?.profile_image ? (
              <img
                src={review.reviewer.profile_image}
                alt={review.reviewer.user_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-blue-600">
                {review.reviewer?.user_name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>

          <div>
            <h4 className="font-bold text-gray-800">
              {review.reviewer?.user_name || "Anonymous"}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatDate(review.created_at)}</span>
              {review.reviewer?.rating && (
                <>
                  <span>•</span>
                  <StarRating
                    rating={review.reviewer.rating}
                    size={12}
                    showValue
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={18} className="text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    onUpdate(review);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit size={16} />
                  Edit Review
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={review.overall_rating} size={18} showValue />
        {review.title && (
          <h5 className="font-bold text-gray-800 mt-2">{review.title}</h5>
        )}
      </div>

      {/* Comment */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Pros/Cons (for item reviews) */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {review.pros && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-bold text-green-800">PROS</span>
              </div>
              <p className="text-xs text-green-700">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={16} className="text-red-600" />
                <span className="text-xs font-bold text-red-800">CONS</span>
              </div>
              <p className="text-xs text-red-700">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleToggleHelpful}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isHelpful
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <ThumbsUp size={16} className={isHelpful ? "fill-blue-700" : ""} />
          Helpful ({helpfulCount})
        </button>

        {review.has_response && (
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            <MessageCircle size={16} />
            Response
          </button>
        )}
      </div>

      {/* Response Section */}
      {showResponse && review.response && (
        <div className="mt-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={16} className="text-purple-600" />
            <span className="text-sm font-bold text-purple-800">
              Response from {review.response.responder}
            </span>
          </div>
          <p className="text-sm text-purple-700">{review.response.response}</p>
          <p className="text-xs text-purple-500 mt-2">
            {formatDate(review.response.created_at)}
          </p>
        </div>
      )}
    </div>
  );
}


// import React from 'react';
// import { ThumbsUp, Flag } from 'lucide-react';
// import StarRating from './StarRating';
// import { Avatar, Badge, Button } from '../common';
// import { formatDate } from '../../utils';

// const ReviewCard = ({ review, showItem = false, onLike, onReport }) => {
//   const {
//     id,
//     rating,
//     comment,
//     user,
//     item,
//     created_at,
//     helpful_count = 0,
//     is_verified = false,
//   } = review;

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <Avatar
//             src={user?.avatar}
//             name={`${user?.first_name} ${user?.last_name}`}
//             size="md"
//           />
//           <div>
//             <div className="flex items-center gap-2">
//               <h4 className="font-semibold text-gray-900 dark:text-white">
//                 {user?.first_name} {user?.last_name}
//               </h4>
//               {is_verified && (
//                 <Badge variant="success" size="sm">
//                   Verified
//                 </Badge>
//               )}
//             </div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {formatDate(created_at)}
//             </p>
//           </div>
//         </div>

//         <StarRating rating={rating} readonly size={18} />
//       </div>

//       {/* Item Info (if showing) */}
//       {showItem && item && (
//         <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//           <img
//             src={item.images?.[0]?.image || '/placeholder-item.jpg'}
//             alt={item.name}
//             className="w-12 h-12 object-cover rounded"
//           />
//           <div className="flex-1 min-w-0">
//             <h5 className="font-medium text-gray-900 dark:text-white truncate">
//               {item.name}
//             </h5>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {item.category_display}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Review Comment */}
//       <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
//         {comment}
//       </p>

//       {/* Footer Actions */}
//       <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
//         <button
//           onClick={() => onLike?.(id)}
//           className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//         >
//           <ThumbsUp size={16} />
//           <span>Helpful ({helpful_count})</span>
//         </button>

//         <button
//           onClick={() => onReport?.(id)}
//           className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
//         >
//           <Flag size={16} />
//           <span>Report</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReviewCard;