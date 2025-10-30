import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Home,
  Send,
  CheckCircle,
  XCircle,
  Truck,
  LoaderCircle,
  MessageCircle,
  Tag,
  Calendar,
  Info,
  AlertCircle,
  Clock,
  ImageIcon,
  ArrowRight,
  Plus,
  Receipt,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductRentPage = ({ itemId }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [histories, setHistories] = useState([]);
  const [renterNote, setRenterNote] = useState("");
  const [ownerNote, setOwnerNote] = useState("");
  const [logisticsProvider, setLogisticsProvider] = useState("");
  const [logisticsDetails, setLogisticsDetails] = useState("");
  const [cancelNote, setCancelNote] = useState("");
  const [extendDays, setExtendDays] = useState("");
  const [fetching, setFetching] = useState(true);
  const [process, setProcess] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [thirdParty, setThirdParty] = useState(false);
  const [showOwnerActions, setShowOwnerActions] = useState(false);
  const [showRenterActions, setShowRenterActions] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("dev1, token:", token);
    if (!token) {
      console.log("No token, so redirect");
      toast.error("Please log in to view this page.");
      return navigate("/login");
    }
    console.log("Token found, fetching user profile...");
    async function fetchUser() {
      try {
        // ✅ FIXED: Use correct endpoint
        const { data } = await axios.get(`${API_BASE_URL}/api/users/me/`, {
          headers: getAuthHeaders(),
        });
        setCurrentUser(data);
        console.log("✅ User profile fetched:", data);
      } catch (e) {
        console.error("❌ User API error:", e);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } finally {
        setCheckedAuth(true);
      }
    }
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser || !checkedAuth) return;
    const fetchData = async () => {
      setFetching(true);
      console.log("itemId:", itemId, typeof itemId);
      try {
        const itemRes = await axios.get(
          `${API_BASE_URL}/api/items/${itemId}/`,
          {
            headers: getAuthHeaders(),
          }
        );
        const itemData = itemRes.data;
        setItem(itemData);
        console.log("✅ Item data:", itemData);

        // ✅ FIXED: Use owner_details directly from item data (no separate API call needed)
        if (itemData.owner_details && itemData.owner_details.id) {
          setOwner(itemData.owner_details);
          console.log("✅ Owner details loaded:", itemData.owner_details);
        } else {
          console.warn("⚠️ No owner details in item data");
          setOwner({
            id: itemData.owner || itemData.owner_id,
            user_name: "Owner",
            email: "Contact through platform",
            phone: "Not available",
            address: "Not specified",
          });
        }

        // Try to fetch bookings for this item
        let itemBookings = [];
        try {
          const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings/`, {
            headers: getAuthHeaders(),
            params: { item: itemId },
          });
          // Filter bookings for this specific item on client side
          itemBookings = bookingsRes.data.filter(
            (b) =>
              b.item === parseInt(itemId) || b.item?.id === parseInt(itemId)
          );
          setBookings(itemBookings);
        } catch (bookingErr) {
          console.log("Could not fetch bookings:", bookingErr);
          setBookings([]);
        }

        // Find the current user's active booking for this item
        const userBooking = itemBookings.find(
          (b) =>
            b.renter &&
            (b.renter.id === currentUser.id || b.renter === currentUser.id) &&
            (b.item === parseInt(itemId) || b.item?.id === parseInt(itemId)) &&
            b.status !== "cancelled" &&
            b.status !== "completed"
        );

        if (userBooking) {
          setBooking(userBooking);
          // Fetch full booking details including history
          const bookingDetailRes = await axios.get(
            `${API_BASE_URL}/api/bookings/${userBooking.id}/`,
            { headers: getAuthHeaders() }
          );
          setHistories(bookingDetailRes.data.history || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Item not found or an error occurred.");
        navigate("/");
      }
      setFetching(false);
    };
    fetchData();
  }, [itemId, process, currentUser, checkedAuth, navigate]);

  const requestBooking = async (dates, thirdPartyReq) => {
    if (isOwner) {
      toast.warning("You cannot book your own item!");
      return;
    }

    // Validate dates
    if (!dates.start_date || !dates.end_date) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const start = new Date(dates.start_date);
    const end = new Date(dates.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Start date cannot be in the past.");
      return;
    }

    if (end <= start) {
      toast.error("End date must be after start date.");
      return;
    }

    setProcess("request");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/`,
        {
          item_id: itemId,
          ...dates,
          renter_note: renterNote,
          third_party_required: thirdPartyReq,
        },
        { headers: getAuthHeaders() }
      );
      setProcess("");
      setBooking(res.data);

      // Clear form
      setStartDate("");
      setEndDate("");
      setRenterNote("");
      setThirdParty(false);

      // Show success toast
      toast.success("🎉 Booking request sent successfully! Redirecting...", {
        autoClose: 2000,
      });

      // Set redirecting state to show loading overlay
      setRedirecting(true);

      // Redirect to order management after 2 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (e) {
      setProcess("");
      const errorMsg =
        e.response?.data?.error ||
        e.response?.data?.detail ||
        e.response?.data?.non_field_errors?.[0] ||
        "Failed to request booking.";
      toast.error(errorMsg);
      console.error("Booking error:", e.response?.data);
    }
  };

  const handleOwnerAccept = async () => {
    setProcess("owner_accept");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/owner_accept/`,
        { owner_note: ownerNote },
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      setOwnerNote("");
      setShowOwnerActions(false);
      toast.success("Booking accepted! Bill created automatically.");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to accept booking.");
    }
  };

  const handleRenterConfirm = async () => {
    setProcess("renter_confirm");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/renter_confirm/`,
        {},
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      setShowRenterActions(false);
      toast.success("Booking confirmed successfully!");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to confirm booking.");
    }
  };

  const handleCancel = async () => {
    setProcess("cancel");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/cancel/`,
        { note: cancelNote },
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      setCancelNote("");
      setShowCancelModal(false);
      toast.success("Booking cancelled successfully!");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to cancel booking.");
    }
  };

  const handleReturn = async () => {
    setProcess("return");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/return/`,
        { note: "Item returned" },
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      toast.success("Item marked as returned!");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to mark as returned.");
    }
  };

  const handleComplete = async () => {
    setProcess("complete");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/complete/`,
        {},
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      toast.success("Booking completed successfully!");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to complete booking.");
    }
  };

  const handleExtend = async () => {
    if (!extendDays || parseInt(extendDays) <= 0) {
      toast.error("Please enter valid number of days.");
      return;
    }
    setProcess("extend");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/extend/`,
        { days: parseInt(extendDays) },
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      setExtendDays("");
      setShowExtendModal(false);
      toast.success(`Booking extended by ${extendDays} days!`);
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to extend booking.");
    }
  };

  const handleAssignLogistics = async () => {
    if (!logisticsProvider) {
      toast.error("Please enter logistics provider.");
      return;
    }
    setProcess("logistics");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/bookings/${booking.id}/assign_logistics/`,
        { provider: logisticsProvider, details: logisticsDetails },
        { headers: getAuthHeaders() }
      );
      setBooking(res.data);
      setLogisticsProvider("");
      setLogisticsDetails("");
      setShowLogisticsModal(false);
      toast.success("Logistics assigned successfully!");
      setProcess("");
    } catch (e) {
      setProcess("");
      toast.error(e.response?.data?.detail || "Failed to assign logistics.");
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    requestBooking({ start_date: startDate, end_date: endDate }, thirdParty);
  };

  // Navigate to billing page
  const goToBilling = (billId) => {
    navigate(`/billing/${billId}`);
  };

  const isOwner = owner && currentUser && owner.id === currentUser.id;
  const isRenter =
    booking &&
    currentUser &&
    (booking.renter?.id === currentUser.id ||
      booking.renter === currentUser.id);

  // ✅ FIXED: Check if item is actually available using is_available property
  const isItemAvailable = item?.is_available === true;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted_by_owner":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "accepted_by_owner":
        return <CheckCircle className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getBillStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      paid: "bg-green-100 text-green-800 border-green-300",
      failed: "bg-red-100 text-red-800 border-red-300",
      refunded: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (fetching || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <LoaderCircle className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  // Show loading overlay during redirect
  if (redirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 border-2 border-indigo-200">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4 animate-bounce" />
            <LoaderCircle className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Request Sent!
          </h3>
          <p className="text-gray-600 mb-4">
            Redirecting you to Order Management...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Please wait a moment</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          {item ? (
            <>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 flex-wrap">
                  <Home className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">{item.name}</h1>
                  <span
                    className={`ml-auto px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold ${
                      isItemAvailable
                        ? "bg-green-500/30 text-white"
                        : "bg-red-500/30 text-white"
                    }`}
                  >
                    {isItemAvailable ? "Available Now" : "Currently Rented"}
                  </span>
                </div>
              </div>

              <div className="p-8">
                {/* Item Details Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <div className="relative group">
                      {item.images &&
                      Array.isArray(item.images) &&
                      item.images.length > 0 ? (
                        <img
                          src={item.images[0].image_url}
                          alt={item.name}
                          className="w-full h-96 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                        />
                      ) : item.image || item.imageUrl ? (
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.name}
                          className="w-full h-96 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 h-96 rounded-2xl border-2 border-dashed border-gray-300">
                          <ImageIcon className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {item.images &&
                      Array.isArray(item.images) &&
                      item.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {item.images.slice(1, 5).map((img, idx) => (
                            <img
                              key={idx}
                              src={img.image_url}
                              alt={`${item.name} ${idx + 2}`}
                              className="w-full h-20 object-cover rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            />
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Item Info Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-4xl font-bold text-indigo-700">
                          ₹{item.price_per_day || item.price || 0}
                        </span>
                        <span className="text-gray-600">/ day</span>
                      </div>
                      {item.deposit_required && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Deposit: ₹{item.deposit_required}</span>
                        </div>
                      )}
                      {(item.minimum_rental_days ||
                        item.maximum_rental_days) && (
                        <div className="mt-2 text-sm text-gray-600">
                          {item.minimum_rental_days && (
                            <div>Min: {item.minimum_rental_days} days</div>
                          )}
                          {item.maximum_rental_days && (
                            <div>Max: {item.maximum_rental_days} days</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Info className="w-5 h-5 text-indigo-600" />
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Tag className="w-4 h-4" />
                          <span className="text-xs font-medium">Category</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {typeof item.category === "object"
                            ? item.category?.name
                            : item.category}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-medium">Location</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {item.location || "Not specified"}
                        </p>
                      </div>

                      {item.condition && (
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <div className="flex items-center gap-2 text-yellow-700 mb-1">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              Condition
                            </span>
                          </div>
                          <p className="font-semibold text-yellow-900">
                            {item.condition}
                          </p>
                        </div>
                      )}

                      {isItemAvailable && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-2 text-green-700 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Status</span>
                          </div>
                          <p className="font-semibold text-green-900">
                            Available for Rent
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        Listed on:{" "}
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                {owner && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <User className="w-6 h-6 text-indigo-600" />
                      Owner Information
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <User className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Name</p>
                          <p className="font-semibold text-gray-900">
                            {owner.user_name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {owner.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="font-semibold text-gray-900">
                            {"Use Paid Verson"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {owner.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Owner Warning */}
                {isOwner && (
                  <div className="mt-8">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-400 rounded-full p-3">
                          <AlertCircle className="w-6 h-6 text-yellow-900" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-yellow-900 mb-1">
                            This is Your Item
                          </h4>
                          <p className="text-yellow-800">
                            You uploaded this item for rent. You cannot book or
                            rent your own item.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Renter Section - Booking Form or Booking Status */}
                {!isOwner && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    {!booking ? (
                      // Booking Request Form
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                          <Send className="w-7 h-7 text-indigo-600" />
                          Rent This Item
                        </h3>

                        {!isItemAvailable && (
                          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-red-900 mb-1">
                                  Currently Unavailable
                                </h4>
                                <p className="text-red-700 text-sm">
                                  This item is currently rented out and cannot
                                  be booked at this time. Please check back
                                  later or contact the owner for availability.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <form
                          onSubmit={handleBookingSubmit}
                          className="space-y-6"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                required
                                disabled={!isItemAvailable || isOwner}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                End Date
                              </label>
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={
                                  startDate ||
                                  new Date().toISOString().split("T")[0]
                                }
                                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                required
                                disabled={!isItemAvailable || isOwner}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Note to Owner (Optional)
                            </label>
                            <textarea
                              placeholder="Add any special requests or information..."
                              className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all min-h-24"
                              value={renterNote}
                              onChange={(e) => setRenterNote(e.target.value)}
                              disabled={!isItemAvailable || isOwner}
                            />
                          </div>
                          <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                            <input
                              type="checkbox"
                              id="third_party"
                              checked={thirdParty}
                              onChange={(e) => setThirdParty(e.target.checked)}
                              className="mt-1 w-5 h-5 accent-indigo-600 cursor-pointer"
                              disabled={!isItemAvailable || isOwner}
                            />
                            <label
                              htmlFor="third_party"
                              className="cursor-pointer"
                            >
                              <span className="font-semibold text-gray-900">
                                Require Third-Party Assistance
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                Request logistics, delivery, or transportation
                                support
                              </p>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              process === "request" ||
                              !startDate ||
                              !endDate ||
                              !isItemAvailable ||
                              isOwner
                            }
                          >
                            {process === "request" ? (
                              <>
                                <LoaderCircle className="animate-spin w-6 h-6" />
                                Sending Request...
                              </>
                            ) : (
                              <>
                                <Send className="w-6 h-6" />
                                {isItemAvailable
                                  ? "Send Booking Request"
                                  : "Currently Unavailable"}
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    ) : (
                      // Existing Booking Display
                      <div className="space-y-6">
                        {/* Booking Status Card */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-lg">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              Your Booking
                            </h3>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.replace(/_/g, " ").toUpperCase()}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Start Date
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(
                                    booking.start_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  End Date
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(
                                    booking.end_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {booking.total_price && (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300">
                                <p className="text-sm text-gray-700 mb-1">
                                  Total Rental Amount
                                </p>
                                <p className="text-3xl font-bold text-green-700">
                                  ₹{booking.total_price}
                                </p>
                              </div>
                            )}

                            {/* ✅ BILLING SECTION - Show if bill exists and booking is NOT cancelled */}
                            {booking.bill && booking.status !== "cancelled" && (
                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-300">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <Receipt className="w-6 h-6 text-indigo-600" />
                                    <h4 className="text-lg font-bold text-gray-900">
                                      Bill Information
                                    </h4>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1 ${getBillStatusColor(
                                      booking.bill.payment_status
                                    )}`}
                                  >
                                    {booking.bill.payment_status === "paid" && (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                    {booking.bill.payment_status ===
                                      "pending" && (
                                      <Clock className="w-4 h-4" />
                                    )}
                                    {booking.bill.payment_status_display ||
                                      booking.bill.payment_status}
                                  </span>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                    <span className="text-sm text-gray-600">
                                      Invoice Number
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {booking.bill.bill_number}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center bg-white rounded-lg p-3">
                                    <span className="text-sm text-gray-600">
                                      Total Amount
                                    </span>
                                    <span className="text-2xl font-bold text-indigo-700">
                                      ₹
                                      {parseFloat(
                                        booking.bill.total_amount
                                      ).toFixed(2)}
                                    </span>
                                  </div>

                                  {booking.bill.payment_status === "paid" &&
                                    booking.bill.paid_at && (
                                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                        <p className="text-xs text-green-700 font-semibold mb-1">
                                          ✓ Payment Completed
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          {new Date(
                                            booking.bill.paid_at
                                          ).toLocaleString()}
                                        </p>
                                        {booking.bill
                                          .payment_method_display && (
                                          <p className="text-xs text-gray-600 mt-1">
                                            Method:{" "}
                                            {
                                              booking.bill
                                                .payment_method_display
                                            }
                                          </p>
                                        )}
                                      </div>
                                    )}

                                  {/* ✅ Payment Button - ONLY for RENTERS when booking is CONFIRMED and bill is PENDING */}
                                  {isRenter &&
                                    booking.bill.payment_status === "pending" &&
                                    booking.status === "confirmed" && (
                                      <button
                                        onClick={() =>
                                          goToBilling(booking.bill.id)
                                        }
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                                      >
                                        <CreditCard className="w-5 h-5" />
                                        Proceed to Payment
                                      </button>
                                    )}

                                  {/* View Bill Button */}
                                  <button
                                    onClick={() => goToBilling(booking.bill.id)}
                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-300 px-6 py-3 rounded-xl font-semibold transition-all"
                                  >
                                    <Receipt className="w-5 h-5" />
                                    View Invoice Details
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Show message if accepted but no bill yet */}
                            {booking.status === "accepted_by_owner" &&
                              !booking.bill && (
                                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 flex items-start gap-3">
                                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-bold text-blue-900 mb-1">
                                      Bill Generation
                                    </p>
                                    <p className="text-sm text-blue-700">
                                      Your bill is being generated. Please
                                      refresh the page in a moment.
                                    </p>
                                  </div>
                                </div>
                              )}

                            {booking.renter_note && (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="text-xs text-blue-600 mb-2 font-semibold">
                                  Your Note to Owner
                                </p>
                                <p className="text-sm text-gray-800">
                                  {booking.renter_note}
                                </p>
                              </div>
                            )}

                            {booking.owner_note && (
                              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <p className="text-xs text-purple-600 mb-2 font-semibold">
                                  Owner's Response
                                </p>
                                <p className="text-sm text-gray-800">
                                  {booking.owner_note}
                                </p>
                              </div>
                            )}

                            {booking.third_party_required && (
                              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <div className="flex items-center gap-2">
                                  <Truck className="w-5 h-5 text-amber-600" />
                                  <p className="text-sm font-semibold text-amber-900">
                                    Third-Party Logistics Required
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Renter Action Buttons */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                          <h4 className="text-lg font-bold text-gray-900 mb-4">
                            Actions
                          </h4>
                          <div className="space-y-3">
                            {/* Confirm Booking - only when accepted by owner AND bill exists */}
                            {isRenter &&
                              booking.status === "accepted_by_owner" &&
                              booking.bill && (
                                <div className="space-y-3">
                                  <button
                                    onClick={handleRenterConfirm}
                                    disabled={process === "renter_confirm"}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                  >
                                    {process === "renter_confirm" ? (
                                      <>
                                        <LoaderCircle className="animate-spin w-5 h-5" />
                                        Confirming...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-5 h-5" />
                                        Confirm Booking
                                      </>
                                    )}
                                  </button>
                                  <p className="text-xs text-gray-600 text-center">
                                    Owner has accepted your request. Confirm to
                                    proceed with the rental.
                                  </p>
                                </div>
                              )}

                            {/* Extend Booking */}
                            {isRenter && booking.status === "confirmed" && (
                              <button
                                onClick={() => setShowExtendModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                              >
                                <Plus className="w-5 h-5" />
                                Extend Rental Period
                              </button>
                            )}

                            {/* Return Item */}
                            {isRenter && booking.status === "confirmed" && (
                              <button
                                onClick={handleReturn}
                                disabled={process === "return"}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                              >
                                {process === "return" ? (
                                  <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="w-5 h-5" />
                                    Mark as Returned
                                  </>
                                )}
                              </button>
                            )}

                            {/* Cancel Booking */}
                            {booking.status !== "cancelled" &&
                              booking.status !== "completed" && (
                                <button
                                  onClick={() => setShowCancelModal(true)}
                                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                  <XCircle className="w-5 h-5" />
                                  Cancel Booking
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Owner Booking Requests Section - Show only last 3 */}
                {isOwner && bookings.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Booking Requests for This Item
                    </h3>
                    <div className="space-y-4">
                      {bookings
                        .filter(
                          (b) =>
                            b.status !== "cancelled" && b.status !== "completed"
                        )
                        .slice(0, 3)
                        .map((b) => (
                          <div
                            key={b.id}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-md"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Renter:{" "}
                                  {b.renter?.user_name ||
                                    b.renter?.username ||
                                    "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {b.renter?.email}
                                </p>
                              </div>
                              <span
                                className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(
                                  b.status
                                )}`}
                              >
                                {b.status.replace(/_/g, " ").toUpperCase()}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gray-100 rounded-lg p-3">
                                <p className="text-xs text-gray-600">Start</p>
                                <p className="font-semibold text-sm">
                                  {new Date(b.start_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3">
                                <p className="text-xs text-gray-600">End</p>
                                <p className="font-semibold text-sm">
                                  {new Date(b.end_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {b.renter_note && (
                              <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                                <p className="text-xs text-blue-600 font-semibold mb-1">
                                  Renter's Note:
                                </p>
                                <p className="text-sm text-gray-800">
                                  {b.renter_note}
                                </p>
                              </div>
                            )}

                            {b.total_price && (
                              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                                <p className="text-xs text-gray-600">
                                  Total Amount
                                </p>
                                <p className="text-xl font-bold text-green-700">
                                  ₹{b.total_price}
                                </p>
                              </div>
                            )}

                            {/* Owner Actions */}
                            {b.status === "pending" && (
                              <div className="space-y-3">
                                <textarea
                                  placeholder="Add a note for the renter (optional)..."
                                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm"
                                  value={ownerNote}
                                  onChange={(e) => setOwnerNote(e.target.value)}
                                  rows={2}
                                />
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => {
                                      setBooking(b);
                                      handleOwnerAccept();
                                    }}
                                    disabled={process === "owner_accept"}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                                  >
                                    {process === "owner_accept" ? (
                                      <>
                                        <LoaderCircle className="animate-spin w-4 h-4" />
                                        Accepting...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4" />
                                        Accept
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setBooking(b);
                                      setShowCancelModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                </div>
                              </div>
                            )}

                            {b.status === "confirmed" && (
                              <div className="space-y-3">
                                {b.third_party_required && (
                                  <button
                                    onClick={() => {
                                      setBooking(b);
                                      setShowLogisticsModal(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                                  >
                                    <Truck className="w-4 h-4" />
                                    Assign Logistics
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setBooking(b);
                                    handleComplete();
                                  }}
                                  disabled={process === "complete"}
                                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                                >
                                  {process === "complete" ? (
                                    <>
                                      <LoaderCircle className="animate-spin w-4 h-4" />
                                      Completing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Mark as Completed
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      {bookings.filter(
                        (b) =>
                          b.status !== "cancelled" && b.status !== "completed"
                      ).length > 3 && (
                        <p className="text-center text-gray-500 mt-4 text-sm">
                          Showing 3 most recent of{" "}
                          {
                            bookings.filter(
                              (b) =>
                                b.status !== "cancelled" &&
                                b.status !== "completed"
                            ).length
                          }{" "}
                          total active bookings
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                Item Not Found
              </h3>
              <p className="text-gray-600 mt-2">
                The requested item could not be loaded.
              </p>
            </div>
          )}
        </div>

        {/* Booking History - Show last 3 */}
        {histories && histories.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <MessageCircle className="w-7 h-7 text-indigo-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {histories
                .slice()
                .reverse()
                .slice(0, 3)
                .map((h, idx) => (
                  <div
                    key={h.id || idx}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 rounded-full p-3 mt-1">
                        <Clock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">
                          {h.timestamp
                            ? new Date(h.timestamp).toLocaleString()
                            : "N/A"}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            {h.previous_status?.replace(/_/g, " ") || "N/A"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {h.new_status?.replace(/_/g, " ") || "N/A"}
                          </span>
                        </div>
                        {h.changed_by && (
                          <p className="text-sm text-gray-600">
                            Changed by:{" "}
                            <span className="font-semibold">
                              {h.changed_by}
                            </span>
                          </p>
                        )}
                        {h.note && (
                          <p className="text-sm text-gray-700 italic mt-2 bg-white rounded-lg p-3 border border-gray-200">
                            "{h.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {histories.length > 3 && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Showing 3 most recent of {histories.length} total events
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <textarea
              placeholder="Reason for cancellation (optional)..."
              className="w-full border-2 border-gray-300 rounded-xl p-3 mb-6 min-h-24"
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelNote("");
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={process === "cancel"}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {process === "cancel" ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Extend Rental Period
            </h3>
            <p className="text-gray-600 mb-6">
              How many additional days would you like to extend?
            </p>
            <input
              type="number"
              placeholder="Number of days"
              className="w-full border-2 border-gray-300 rounded-xl p-3 mb-6"
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
              min="1"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setExtendDays("");
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExtend}
                disabled={process === "extend"}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {process === "extend" ? "Extending..." : "Extend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logistics Modal */}
      {showLogisticsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Assign Logistics Provider
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Provider Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blue Dart, DHL, Local Transport"
                  className="w-full border-2 border-gray-300 rounded-xl p-3"
                  value={logisticsProvider}
                  onChange={(e) => setLogisticsProvider(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Details (Optional)
                </label>
                <textarea
                  placeholder="Tracking number, contact info, etc."
                  className="w-full border-2 border-gray-300 rounded-xl p-3 min-h-24"
                  value={logisticsDetails}
                  onChange={(e) => setLogisticsDetails(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogisticsModal(false);
                  setLogisticsProvider("");
                  setLogisticsDetails("");
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignLogistics}
                disabled={process === "logistics"}
                className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {process === "logistics" ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRentPage;
