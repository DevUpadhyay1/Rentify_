import React, { useState } from "react";
import { Star, AlertCircle, Clock } from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Loader,
  EmptyState,
  Alert,
} from "../../components/common";
import { ReviewModal } from "../../components/review";
import { useFetch } from "../../hooks";
import { orderService, reviewService } from "../../api";
import { formatDate, formatCurrency } from "../../utils";

const PendingReviews = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch completed orders without reviews
  const {
    data: pendingOrders,
    loading,
    error,
    refetch,
  } = useFetch(() => orderService.getPendingReviews(), []);

  const handleWriteReview = (order) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewService.create({
        item: selectedOrder.item.id,
        order: selectedOrder.id,
        ...reviewData,
      });
      setReviewModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (error) {
    return (
      <div className="container-custom py-12">
        <Alert
          type="error"
          title="Error loading pending reviews"
          message={error.message || "Failed to load pending reviews"}
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pending Reviews
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Write reviews for your completed rentals
        </p>
      </div>

      {/* Alert */}
      {pendingOrders?.length > 0 && (
        <Alert
          type="info"
          icon={<AlertCircle size={20} />}
          title={`You have ${pendingOrders.length} pending ${
            pendingOrders.length === 1 ? "review" : "reviews"
          }`}
          message="Help others by sharing your rental experience"
          className="mb-6"
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <Loader text="Loading pending reviews..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && pendingOrders?.length === 0 && (
        <EmptyState
          icon={<Star size={64} />}
          title="No pending reviews"
          message="All your completed rentals have been reviewed. Thank you!"
          actionLabel="Browse Items"
          onAction={() => (window.location.href = "/items")}
        />
      )}

      {/* Pending Reviews List */}
      {!loading && pendingOrders?.length > 0 && (
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <Card key={order.id} padding="md" hover>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Item Image */}
                <img
                  src={
                    order.item?.images?.[0]?.image || "/placeholder-item.jpg"
                  }
                  alt={order.item?.name}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {order.item?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.item?.category_display}
                      </p>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Rental Period
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(order.start_date)} -{" "}
                        {formatDate(order.end_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.duration} days
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Total Paid
                      </p>
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(order.total_price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Completed On
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(order.completed_at)}
                      </p>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={order.item?.owner?.avatar || "/default-avatar.png"}
                      alt={order.item?.owner?.first_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Rented from{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {order.item?.owner?.first_name}{" "}
                        {order.item?.owner?.last_name}
                      </span>
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleWriteReview(order)}
                    icon={<Star size={16} />}
                  >
                    Write Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedOrder && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedOrder(null);
          }}
          item={selectedOrder.item}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default PendingReviews;
