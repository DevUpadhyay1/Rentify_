import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Calendar,
  User,
  Package,
  Loader2,
  Filter,
  TrendingUp,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import reviewService from "../../api/reviewService";
import StarRating from "../review/StarRating";

export default function MyReviews() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("received");
  const [filterType, setFilterType] = useState("all");
  const [reviews, setReviews] = useState({
    received: [],
    given: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getMyReviews();
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewType, reviewId) => {
    try {
      await reviewService.toggleHelpful(reviewType, reviewId);
      fetchReviews();
      toast.success("Marked as helpful!");
    } catch (error) {
      toast.error("Failed to mark as helpful");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ReviewCard = ({ review, type }) => {
    const reviewerName =
      type === "received"
        ? review.reviewer_name || "Anonymous"
        : review.target_name || "User";

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{reviewerName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size={14} />
                <span className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            {review.review_type}
          </span>
        </div>

        <p className="text-gray-700 mb-4">{review.comment}</p>

        {review.item_name && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{review.item_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => handleHelpful(review.review_type, review.id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful ({review.helpful_count || 0})
          </button>
          {review.response && (
            <span className="text-xs text-green-600 font-medium">
              ✓ Response given
            </span>
          )}
        </div>
      </div>
    );
  };

  const currentReviews =
    activeTab === "received" ? reviews.received : reviews.given;
  const filteredReviews =
    filterType === "all"
      ? currentReviews
      : currentReviews.filter((r) => r.review_type === filterType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600">Manage and view all your reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.received.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Given</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.given.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.received.length > 0
                    ? (
                        reviews.received.reduce((acc, r) => acc + r.rating, 0) /
                        reviews.received.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "received"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Received ({reviews.received.length})
            </button>
            <button
              onClick={() => setActiveTab("given")}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                activeTab === "given"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Given ({reviews.given.length})
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="item">Item Reviews</option>
            <option value="owner">Owner Reviews</option>
            <option value="renter">Renter Reviews</option>
          </select>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "received"
                ? "You haven't received any reviews yet"
                : "You haven't given any reviews yet"}
            </p>
            <button
              onClick={() => navigate("/reviews/pending")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Check Pending Reviews
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} type={activeTab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
