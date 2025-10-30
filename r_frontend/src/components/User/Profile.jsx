import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Loader2,
  Save,
  Camera,
  Edit,
  AlertCircle,
  CheckCircle,
  X,
  Shield,
  Award,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import reviewService from "../../api/reviewService";
import StarRating from "../review/StarRating";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    email: "",
    user_name: "",
    phone: "",
    address: "",
    rating: 0,
    total_ratings: 0,
    date_joined: "",
    profile_image: "",
  });
  const [form, setForm] = useState({
    user_name: "",
    phone: "",
    address: "",
    profile_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [reviewStats, setReviewStats] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchProfile();
    fetchReviewStats();

    // Listen for review submission events to refresh stats
    const handleReviewSubmitted = () => {
      fetchReviewStats();
      fetchProfile(); // Also refresh profile to update overall rating
    };

    window.addEventListener("reviewSubmitted", handleReviewSubmitted);

    return () => {
      window.removeEventListener("reviewSubmitted", handleReviewSubmitted);
    };
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/user/profile/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const profileData = response.data;
      const validImageUrl =
        profileData.profile_image &&
        profileData.profile_image !== "data:;base64,=" &&
        profileData.profile_image.startsWith("http")
          ? profileData.profile_image
          : null;

      setProfile({
        ...profileData,
        profile_image: validImageUrl,
      });

      setForm({
        user_name: profileData.user_name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        profile_image: null,
      });

      setImagePreview(validImageUrl);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await reviewService.getUserStats(userId);
        setReviewStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching review stats:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setForm((prev) => ({
        ...prev,
        profile_image: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("user_name", form.user_name);
      formData.append("phone", form.phone || "");
      formData.append("address", form.address || "");

      if (form.profile_image) {
        formData.append("profile_image", form.profile_image);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/auth/user/profile/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedProfile = response.data;
      const validImageUrl =
        updatedProfile.profile_image &&
        updatedProfile.profile_image !== "data:;base64,=" &&
        updatedProfile.profile_image.startsWith("http")
          ? updatedProfile.profile_image
          : null;

      setProfile({
        ...updatedProfile,
        profile_image: validImageUrl,
      });

      setForm({
        user_name: updatedProfile.user_name || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
        profile_image: null,
      });

      setImagePreview(validImageUrl);
      setEditMode(false);
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  function formatDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Success/Error Alert */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl shadow-md border overflow-hidden ${
              message.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              {message.type === "success" ? (
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={20}
                />
              ) : (
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    message.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {message.text}
                </p>
              </div>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
              {/* Profile Image */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                  {(imagePreview || profile.profile_image) &&
                  (imagePreview || profile.profile_image).startsWith("http") ? (
                    <img
                      src={imagePreview || profile.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback =
                          e.target.parentElement.querySelector(
                            ".fallback-initials"
                          );
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className="fallback-initials w-full h-full flex items-center justify-center bg-blue-600"
                    style={{
                      display:
                        (imagePreview || profile.profile_image) &&
                        (imagePreview || profile.profile_image).startsWith(
                          "http"
                        )
                          ? "none"
                          : "flex",
                    }}
                  >
                    <span className="text-3xl font-bold text-white">
                      {getInitials(profile.user_name || "User")}
                    </span>
                  </div>
                </div>

                {editMode && (
                  <>
                    <button
                      className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all"
                      onClick={() => fileInputRef.current.click()}
                      type="button"
                      title="Change Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.user_name || "User"}
                </h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Mail size={12} />
                  {profile.email}
                </p>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                className={`w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  editMode
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={() => {
                  if (!editMode) {
                    setEditMode(true);
                  } else {
                    setEditMode(false);
                    setForm({
                      user_name: profile.user_name || "",
                      phone: profile.phone || "",
                      address: profile.address || "",
                      profile_image: null,
                    });
                    setImagePreview(profile.profile_image || null);
                    setMessage({ type: "", text: "" });
                  }
                }}
              >
                {editMode ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>

              {/* Stats */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                {/* Rating */}
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-amber-900">
                          Rating
                        </p>
                        <p className="text-lg font-bold text-amber-600">
                          {profile.rating?.toFixed?.(1) || "0.0"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-amber-700 font-medium">
                        {profile.total_ratings || 0}
                      </p>
                      <p className="text-xs text-amber-600">reviews</p>
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-900">
                        Member Since
                      </p>
                      <p className="text-sm font-semibold text-blue-700">
                        {profile.date_joined
                          ? formatDate(profile.date_joined)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-900">
                        Account Status
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-green-700">
                          {profile.is_active ? "Verified" : "Unverified"}
                        </span>
                        {profile.is_active && (
                          <CheckCircle size={14} className="text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Stats */}
                {reviewStats && (
                  <>
                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-purple-900">
                            As Owner
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={reviewStats.as_owner?.average_rating || 0}
                              size={12}
                            />
                            <span className="text-sm font-semibold text-purple-700">
                              {reviewStats.as_owner?.average_rating?.toFixed(
                                1
                              ) || "0.0"}
                            </span>
                            <span className="text-xs text-purple-600">
                              ({reviewStats.as_owner?.total_reviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-3 border border-pink-200">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Award className="w-4 h-4 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-pink-900">
                            As Renter
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={
                                reviewStats.as_renter?.average_rating || 0
                              }
                              size={12}
                            />
                            <span className="text-sm font-semibold text-pink-700">
                              {reviewStats.as_renter?.average_rating?.toFixed(
                                1
                              ) || "0.0"}
                            </span>
                            <span className="text-xs text-pink-600">
                              ({reviewStats.as_renter?.total_reviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* View Reviews Button */}
              <button
                onClick={() => navigate("/reviews")}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                View All Reviews
              </button>
            </div>
          </div>

          {/* Right Side - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    Username
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="user_name"
                    disabled={!editMode}
                    required
                    value={form.user_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-gray-700 outline-none transition-all ${
                      editMode
                        ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                      Read-only
                    </span>
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed">
                    {profile.email || "email@example.com"}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    disabled={!editMode}
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-gray-700 outline-none transition-all ${
                      editMode
                        ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Location
                  </label>
                  <input
                    name="address"
                    disabled={!editMode}
                    value={form.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-gray-700 outline-none transition-all ${
                      editMode
                        ? "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    placeholder="City, State, Country"
                  />
                </div>

                {/* Submit Button */}
                {editMode && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 rounded-xl text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
