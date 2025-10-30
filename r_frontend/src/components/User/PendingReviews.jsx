import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Loader2,
  Star,
  Search,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import reviewService from "../../api/reviewService";
import ReviewModal from "../review/ReviewModal";

export default function PendingReviews() {
  const [pending, setPending] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, item, owner
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [pending, searchQuery, filterType, sortBy]);

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getPendingReviews();
      setPending(response.data || []);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load pending reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let filtered = [...pending];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType === "item") {
      filtered = filtered.filter((item) => item.needs_item_review);
    } else if (filterType === "owner") {
      filtered = filtered.filter((item) => item.needs_owner_review);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.end_date);
      const dateB = new Date(b.end_date);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredReviews(filtered);
  };

  const handleWriteReview = (item) => {
    setSelectedReview(item);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = (success) => {
    setShowReviewModal(false);
    setSelectedReview(null);
    if (success) {
      fetchPendingReviews();
      toast.success("Review submitted successfully!");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            {pending.length} review{pending.length !== 1 ? "s" : ""} pending
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search item or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Reviews</option>
              <option value="item">Item Reviews</option>
              <option value="owner">Owner Reviews</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Reviews Table */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No pending reviews</p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Rental Period</div>
              <div className="col-span-2">Review Type</div>
              <div className="col-span-2">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((item) => (
                <div
                  key={item.booking_id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Item Name */}
                  <div className="col-span-1 md:col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.item_name}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">
                          ID: {item.booking_id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {item.owner_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm text-gray-700">
                        {item.owner_name || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.start_date)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.end_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Type */}
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {item.needs_item_review && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                          Item
                        </span>
                      )}
                      {item.needs_owner_review && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="col-span-1 md:col-span-2">
                    <button
                      onClick={() => handleWriteReview(item)}
                      className="w-full md:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredReviews.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredReviews.length} of {pending.length} review
              {pending.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewSubmitted}
          reviewType="item"
          itemId={selectedReview.item_id}
          ownerId={selectedReview.owner_id}
          bookingId={selectedReview.booking_id}
          needsItemReview={selectedReview.needs_item_review}
          needsOwnerReview={selectedReview.needs_owner_review}
        />
      )}
    </div>
  );
}
