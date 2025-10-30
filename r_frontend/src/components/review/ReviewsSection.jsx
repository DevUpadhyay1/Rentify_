import React, { useState, useEffect } from "react";
import { Star, TrendingUp, MessageSquarePlus } from "lucide-react";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import reviewService from "../../api/reviewService";
import { toast } from "react-toastify";

export default function ReviewsSection({ itemId, reviewType = "item" }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [itemId, reviewType]);

  const fetchReviews = async () => {
    try {
      let response;
      if (reviewType === "item") {
        response = await reviewService.getItemReviews(itemId);
      }
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (reviewType === "item") {
        const response = await reviewService.getItemReviewStats(itemId);
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      if (reviewType === "item") {
        await reviewService.deleteItemReview(reviewId);
      }
      setReviews(reviews.filter((r) => r.id !== reviewId));
      fetchStats();
    } catch (error) {
      throw error;
    }
  };

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.overall_rating === parseInt(filter));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && stats.total_reviews > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Overall Rating
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={stats.average_rating} size={24} />
                  <p className="text-sm text-gray-600 mt-2">
                    Based on {stats.total_reviews} review
                    {stats.total_reviews !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    stats.rating_distribution[rating.toString()] || 0;
                  const percentage =
                    stats.total_reviews > 0
                      ? (count / stats.total_reviews) * 100
                      : 0;

                  return (
                    <button
                      key={rating}
                      onClick={() => setFilter(rating.toString())}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        filter === rating.toString()
                          ? "bg-white shadow-md"
                          : "hover:bg-white/50"
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-700 w-8">
                        {rating}★
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter Button */}
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-6 px-6 py-2 rounded-full bg-white text-purple-600 font-semibold text-sm hover:shadow-lg transition-all"
            >
              Show All Reviews
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Reviews ({filteredReviews.length})
          </h3>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
            <MessageSquarePlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-600 mb-2">
              No Reviews Yet
            </h4>
            <p className="text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                reviewType={reviewType}
                onUpdate={() => {}}
                onDelete={handleDeleteReview}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import { Star, ThumbsUp, Filter } from "lucide-react";
// import { Button, Select, EmptyState, Loader } from "../common";
// import ReviewCard from "./ReviewCard";
// import StarRating from "./StarRating";
// import { useFetch } from "../../hooks";
// import { reviewService } from "../../api";

// const ReviewsSection = ({ itemId }) => {
//   const [filterRating, setFilterRating] = useState("all");
//   const [sortBy, setSortBy] = useState("recent"); // recent, helpful, rating_high, rating_low

//   // Fetch reviews
//   const {
//     data: reviews,
//     loading,
//     error,
//   } = useFetch(() => reviewService.getByItem(itemId), [itemId]);

//   // Calculate stats
//   const stats = {
//     total: reviews?.length || 0,
//     average: reviews?.length
//       ? (
//           reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//         ).toFixed(1)
//       : 0,
//     distribution: {
//       5: reviews?.filter((r) => r.rating === 5).length || 0,
//       4: reviews?.filter((r) => r.rating === 4).length || 0,
//       3: reviews?.filter((r) => r.rating === 3).length || 0,
//       2: reviews?.filter((r) => r.rating === 2).length || 0,
//       1: reviews?.filter((r) => r.rating === 1).length || 0,
//     },
//   };

//   // Filter and sort reviews
//   let filteredReviews = reviews || [];

//   if (filterRating !== "all") {
//     filteredReviews = filteredReviews.filter(
//       (review) => review.rating === parseInt(filterRating)
//     );
//   }

//   filteredReviews = [...filteredReviews].sort((a, b) => {
//     switch (sortBy) {
//       case "recent":
//         return new Date(b.created_at) - new Date(a.created_at);
//       case "helpful":
//         return (b.helpful_count || 0) - (a.helpful_count || 0);
//       case "rating_high":
//         return b.rating - a.rating;
//       case "rating_low":
//         return a.rating - b.rating;
//       default:
//         return 0;
//     }
//   });

//   const filterOptions = [
//     { value: "all", label: "All Ratings" },
//     { value: "5", label: "5 Stars" },
//     { value: "4", label: "4 Stars" },
//     { value: "3", label: "3 Stars" },
//     { value: "2", label: "2 Stars" },
//     { value: "1", label: "1 Star" },
//   ];

//   const sortOptions = [
//     { value: "recent", label: "Most Recent" },
//     { value: "helpful", label: "Most Helpful" },
//     { value: "rating_high", label: "Highest Rating" },
//     { value: "rating_low", label: "Lowest Rating" },
//   ];

//   const handleLike = async (reviewId) => {
//     try {
//       await reviewService.like(reviewId);
//       // Refresh reviews
//     } catch (err) {
//       console.error("Failed to like review:", err);
//     }
//   };

//   const handleReport = async (reviewId) => {
//     try {
//       await reviewService.report(reviewId);
//       alert("Review reported successfully");
//     } catch (err) {
//       console.error("Failed to report review:", err);
//     }
//   };

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">Failed to load reviews</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Stats */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//           Customer Reviews
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Overall Rating */}
//           <div className="text-center md:text-left">
//             <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
//               <div className="text-5xl font-bold text-gray-900 dark:text-white">
//                 {stats.average}
//               </div>
//               <div>
//                 <StarRating
//                   rating={parseFloat(stats.average)}
//                   readonly
//                   size={20}
//                 />
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Based on {stats.total}{" "}
//                   {stats.total === 1 ? "review" : "reviews"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Rating Distribution */}
//           <div className="space-y-2">
//             {[5, 4, 3, 2, 1].map((rating) => {
//               const count = stats.distribution[rating];
//               const percentage =
//                 stats.total > 0 ? (count / stats.total) * 100 : 0;

//               return (
//                 <div key={rating} className="flex items-center gap-3">
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
//                     {rating} ★
//                   </span>
//                   <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                     <div
//                       className="bg-yellow-400 h-2 rounded-full transition-all"
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
//                     {count}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Filters & Sort */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <Select
//           value={filterRating}
//           onChange={(e) => setFilterRating(e.target.value)}
//           options={filterOptions}
//           icon={<Filter size={16} />}
//           className="sm:w-48"
//         />

//         <Select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           options={sortOptions}
//           className="sm:w-48"
//         />

//         <div className="sm:ml-auto text-sm text-gray-600 dark:text-gray-400 self-center">
//           {filteredReviews.length}{" "}
//           {filteredReviews.length === 1 ? "review" : "reviews"}
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="py-8">
//           <Loader text="Loading reviews..." />
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && filteredReviews.length === 0 && (
//         <EmptyState
//           icon={<Star size={64} />}
//           title="No reviews yet"
//           message={
//             filterRating !== "all"
//               ? "No reviews match the selected filter"
//               : "Be the first to review this item!"
//           }
//         />
//       )}

//       {/* Reviews List */}
//       {!loading && filteredReviews.length > 0 && (
//         <div className="space-y-4">
//           {filteredReviews.map((review) => (
//             <ReviewCard
//               key={review.id}
//               review={review}
//               onLike={handleLike}
//               onReport={handleReport}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewsSection;
