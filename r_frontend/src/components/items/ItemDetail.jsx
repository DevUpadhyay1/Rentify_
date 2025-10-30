import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Package,
  Shield,
  CheckCircle,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
  AlertCircle,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import reviewService from "../../api/reviewService";
import StarRating from "../review/StarRating";
import ReviewsSection from "../review/ReviewsSection";
import ReviewModal from "../review/ReviewModal";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewStats, setReviewStats] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItemDetails();
    fetchReviewStats();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await reviewService.getItemReviewStats(id);
      setReviewStats(response.data);
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const handleReviewSubmitted = (success) => {
    setShowReviewModal(false);
    if (success) {
      fetchReviewStats();
      fetchItemDetails();
      toast.success("Review submitted successfully!");
    }
  };

  const nextImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) =>
        prev === item.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? item.images.length - 1 : prev - 1
      );
    }
  };

  const handleRentNow = () => {
    if (!token) {
      toast.error("Please login to rent this item");
      navigate("/login");
      return;
    }
    navigate(`/items/${id}/rent`);
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.error("Please login to add favorites");
      navigate("/login");
      return;
    }

    try {
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Item not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const images =
    item.images?.length > 0
      ? item.images
      : [{ image_url: "/placeholder-image.jpg" }];
  const currentImage = images[currentImageIndex];
  const isOwner = item.owner_details?.id === parseInt(currentUserId);
  const isAvailable = item.is_available === true;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={currentImage.image_url || "/placeholder-image.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-800" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                >
                  <Heart
                    size={20}
                    className={
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                    }
                  />
                </button>
                <button
                  onClick={() => {
                    navigator
                      .share?.({
                        title: item.name,
                        text: `Check out ${item.name} on Rentify`,
                        url: window.location.href,
                      })
                      .catch(() => toast.info("Link copied to clipboard"));
                  }}
                  className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                >
                  <Share2 size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Availability Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg ${
                    isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {isAvailable ? "Available" : "Rented Out"}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-600 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.image_url || "/placeholder-image.jpg"}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {item.name}
              </h1>

              <div className="flex items-center gap-2 flex-wrap mb-6">
                {item.category && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                    {typeof item.category === "object"
                      ? item.category.name
                      : item.category}
                  </span>
                )}
                {item.condition && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 capitalize">
                    {item.condition}
                  </span>
                )}
              </div>

              {/* Review Stats */}
              {reviewStats && reviewStats.total_reviews > 0 && (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StarRating
                        rating={reviewStats.average_rating}
                        size={18}
                      />
                      <span className="text-xl font-bold text-amber-600">
                        {reviewStats.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {reviewStats.total_reviews}{" "}
                        {reviewStats.total_reviews === 1 ? "review" : "reviews"}
                      </p>
                      <button
                        onClick={() => setActiveTab("reviews")}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Price - Clean & Simple */}
              <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rental Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{item.price_per_day}
                      </span>
                      <span className="text-lg text-gray-600">/day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rent Now / Owner Warning */}
              {isOwner ? (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">
                        Your Item
                      </h4>
                      <p className="text-sm text-amber-700">
                        You cannot rent your own items.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRentNow}
                  disabled={!isAvailable}
                  className="w-full py-3.5 px-6 rounded-xl text-base font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                  <Calendar size={20} />
                  {isAvailable ? "Rent Now" : "Currently Unavailable"}
                </button>
              )}
            </div>

            {/* Owner Info */}
            {item.owner_details && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                  Listed by
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.owner_details.profile_image ? (
                      <img
                        src={item.owner_details.profile_image}
                        alt={item.owner_details.user_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-600">
                        {item.owner_details.user_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {item.owner_details.user_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating
                        rating={item.owner_details.rating || 0}
                        size={14}
                      />
                      <span className="text-sm text-gray-600">
                        ({item.owner_details.total_ratings || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                Details
              </h3>
              <div className="space-y-3">
                {item.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.location}
                      </p>
                    </div>
                  </div>
                )}

                {item.security_deposit && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="text-gray-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Security Deposit
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{item.security_deposit}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="text-gray-500" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Listed On
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-6 p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "reviews"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Reviews ({reviewStats?.total_reviews || 0})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="text-blue-600" size={24} />
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
              {item.description}
            </p>

            {item.terms_and_conditions && (
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="text-amber-600" size={20} />
                  Terms & Conditions
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.terms_and_conditions}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={24} />
                Customer Reviews
              </h2>
              {token && !isOwner && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>

            <ReviewsSection itemId={id} reviewType="item" />
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewSubmitted}
          reviewType="item"
          itemId={parseInt(id)}
          bookingId={null}
        />
      )}
    </div>
  );
}
