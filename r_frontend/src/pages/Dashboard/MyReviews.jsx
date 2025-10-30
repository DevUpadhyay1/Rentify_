import React, { useState } from "react";
import { Star, Edit, Trash2, Search } from "lucide-react";
import {
  Card,
  Button,
  Input,
  Loader,
  EmptyState,
  Alert,
  Modal,
} from "../../components/common";
import { ReviewCard } from "../../components/review";
import { useFetch } from "../../hooks";
import { reviewService } from "../../api";
import { formatDate } from "../../utils";

const MyReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Fetch user's reviews
  const {
    data: reviews,
    loading,
    error,
    refetch,
  } = useFetch(() => reviewService.getUserReviews(), []);

  // Filter reviews
  const filteredReviews = reviews?.filter((review) =>
    review.item?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (reviewId) => {
    // Navigate to edit review page or open modal
    console.log("Edit review:", reviewId);
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await reviewService.delete(reviewToDelete.id);
      setDeleteModalOpen(false);
      setReviewToDelete(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // Calculate average rating
  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : 0;

  if (error) {
    return (
      <div className="container-custom py-12">
        <Alert
          type="error"
          title="Error loading reviews"
          message={error.message || "Failed to load your reviews"}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reviews you've written for rented items
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Star size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Reviews
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Star size={24} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgRating} / 5
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Edit size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reviews This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reviews?.filter((r) => {
                  const reviewDate = new Date(r.created_at);
                  const now = new Date();
                  return (
                    reviewDate.getMonth() === now.getMonth() &&
                    reviewDate.getFullYear() === now.getFullYear()
                  );
                }).length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6" padding="md">
        <Input
          placeholder="Search reviews by item name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={16} />}
          fullWidth
        />
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <Loader text="Loading reviews..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReviews?.length === 0 && (
        <EmptyState
          icon={<Star size={64} />}
          title="No reviews yet"
          message={
            searchQuery
              ? "No reviews match your search"
              : "You haven't written any reviews yet"
          }
          actionLabel="Browse Items"
          onAction={() => (window.location.href = "/items")}
        />
      )}

      {/* Reviews List */}
      {!loading && filteredReviews?.length > 0 && (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} padding="md">
              <ReviewCard review={review} showItem />

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(review.id)}
                  icon={<Edit size={16} />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(review)}
                  icon={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Review"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete your review for{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {reviewToDelete?.item?.name}
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default MyReviews;
