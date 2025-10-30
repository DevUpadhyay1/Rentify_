import api from "./axios";

const reviewService = {
  // Get pending reviews
  getPendingReviews: () => {
    return api.get("api/reviews/pending/");
  },

  // Create item review
  createItemReview: (data) => {
    return api.post("api/reviews/items/", data);
  },

  // Create owner review
  createOwnerReview: (data) => {
    return api.post("api/reviews/owners/", data);
  },

  // Create renter review
  createRenterReview: (data) => {
    return api.post("api/reviews/renters/", data);
  },

  // Get item reviews
  getItemReviews: (itemId) => {
    return api.get(`api/reviews/items/?item=${itemId}`);
  },

  // Get owner reviews
  getOwnerReviews: (ownerId) => {
    return api.get(`api/reviews/owners/?owner=${ownerId}`);
  },

  // Get my reviews
  getMyReviews: () => {
    return api.get("api/reviews/my-reviews/");
  },

  // Toggle helpful
  toggleHelpful: (reviewType, reviewId) => {
    return api.post("api/reviews/toggle-helpful/", {
      review_type: reviewType,
      review_id: reviewId,
    });
  },

  // Create response
  createResponse: (data) => {
    return api.post("/reviews/responses/", data);
  },

  // Get item stats
  getItemStats: (itemId) => {
    return api.get(`/reviews/items/${itemId}/stats/`);
  },

  // ✅ Get user stats (correct method name)
  getUserStats: (userId) => {
    return api.get(`/reviews/users/${userId}/stats/`);
  },
};

export default reviewService;
