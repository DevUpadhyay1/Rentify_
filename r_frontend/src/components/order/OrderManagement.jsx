import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  LoaderCircle,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  CreditCard,
  Receipt,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  TrendingUp,
  FileText,
  Info,
} from "lucide-react";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const statusMap = {
  pending: "Pending",
  accepted_by_owner: "Accepted by Owner",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const OrderManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Modals
  const [showLogisticsModal, setShowLogisticsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [logisticsProvider, setLogisticsProvider] = useState("");
  const [logisticsDetails, setLogisticsDetails] = useState("");
  const [ownerNote, setOwnerNote] = useState("");
  const [cancelNote, setCancelNote] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showOwnerNoteModal, setShowOwnerNoteModal] = useState(false);
  const [extendDays, setExtendDays] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);

  // ✅ NEW: Filters and UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, amount
  const [expandedBookings, setExpandedBookings] = useState(new Set());
  const [activeTab, setActiveTab] = useState("owner"); // owner or renter

  useEffect(() => {
    axios
      .get("/api/auth/me/", { headers: getAuthHeaders() })
      .then((res) => setCurrentUser(res.data))
      .catch(() => toast.error("Failed to load user info"));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchBookings();
  }, [currentUser]);

  const fetchBookings = () => {
    setFetching(true);
    axios
      .get("/api/bookings/", { headers: getAuthHeaders() })
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setFetching(false));
  };

  // ✅ Toggle booking details
  const toggleBookingDetails = (bookingId) => {
    setExpandedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  // --- Actions (same as before) ---
  const ownerAccept = async (bookingId, note) => {
    setProcessingId(bookingId);
    try {
      const res = await axios.post(
        `/api/bookings/${bookingId}/owner_accept/`,
        { owner_note: note },
        { headers: getAuthHeaders() }
      );
      toast.success("Booking accepted! Bill created automatically.");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === bookingId ? res.data : b))
      );
      setShowOwnerNoteModal(false);
      setOwnerNote("");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to accept.");
    } finally {
      setProcessingId(null);
    }
  };

  const renterConfirm = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      const res = await axios.post(
        `/api/bookings/${bookingId}/renter_confirm/`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Booking confirmed!");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === bookingId ? res.data : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to confirm.");
    } finally {
      setProcessingId(null);
    }
  };

  const assignLogistics = async () => {
    if (!logisticsProvider) {
      toast.error("Please enter provider name");
      return;
    }
    setProcessingId(selectedBooking.id);
    try {
      const res = await axios.post(
        `/api/bookings/${selectedBooking.id}/assign_logistics/`,
        { provider: logisticsProvider, details: logisticsDetails },
        { headers: getAuthHeaders() }
      );
      toast.success("Logistics assigned!");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === selectedBooking.id ? res.data : b))
      );
      setShowLogisticsModal(false);
      setLogisticsProvider("");
      setLogisticsDetails("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to assign logistics.");
    } finally {
      setProcessingId(null);
    }
  };

  const cancelBooking = async () => {
    setProcessingId(selectedBooking.id);
    try {
      const res = await axios.post(
        `/api/bookings/${selectedBooking.id}/cancel/`,
        { note: cancelNote },
        { headers: getAuthHeaders() }
      );
      toast.success("Booking cancelled. Item is now available again.");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === selectedBooking.id ? res.data : b))
      );
      setShowCancelModal(false);
      setCancelNote("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to cancel.");
    } finally {
      setProcessingId(null);
    }
  };

  const returnItem = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      const res = await axios.post(
        `/api/bookings/${bookingId}/return/`,
        { note: "Item returned" },
        { headers: getAuthHeaders() }
      );
      toast.success("Item marked as returned and available!");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === bookingId ? res.data : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to mark as returned.");
    } finally {
      setProcessingId(null);
    }
  };

  const completeBooking = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      const res = await axios.post(
        `/api/bookings/${bookingId}/complete/`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Booking completed!");
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === bookingId ? res.data : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to complete booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const extendBooking = async () => {
    if (!extendDays || parseInt(extendDays) <= 0) {
      toast.error("Please enter valid number of days");
      return;
    }
    setProcessingId(selectedBooking.id);
    try {
      const res = await axios.post(
        `/api/bookings/${selectedBooking.id}/extend/`,
        { days: parseInt(extendDays) },
        { headers: getAuthHeaders() }
      );
      toast.success(`Booking extended by ${extendDays} days!`);
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === selectedBooking.id ? res.data : b))
      );
      setShowExtendModal(false);
      setExtendDays("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to extend booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const goToBilling = (billId) => {
    navigate(`/billing/${billId}`);
  };

  // ✅ Filter and sort bookings
  const ownerBookings = bookings.filter(
    (b) =>
      b.owner && (b.owner.id === currentUser?.id || b.owner === currentUser?.id)
  );

  const renterBookings = bookings.filter(
    (b) =>
      b.renter &&
      (b.renter.id === currentUser?.id || b.renter === currentUser?.id)
  );

  const filterAndSortBookings = (bookingsList) => {
    let filtered = bookingsList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.id.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "amount":
          return (
            parseFloat(b.total_price || 0) - parseFloat(a.total_price || 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  const displayBookings =
    activeTab === "owner"
      ? filterAndSortBookings(ownerBookings)
      : filterAndSortBookings(renterBookings);

  if (fetching || !currentUser)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="animate-spin w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );

  // ✅ PROFESSIONAL BOOKING CARD with collapsible details
  const BookingCard = ({ booking, isOwnerSection }) => {
    const isExpanded = expandedBookings.has(booking.id);
    const isProcessing = processingId === booking.id;

    const getStatusColor = (status) => {
      const colors = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        accepted_by_owner: "bg-blue-50 text-blue-700 border-blue-200",
        confirmed: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        completed: "bg-gray-50 text-gray-700 border-gray-200",
      };
      return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "pending":
          return <Clock className="w-4 h-4" />;
        case "accepted_by_owner":
          return <CheckCircle className="w-4 h-4" />;
        case "confirmed":
          return <CheckCircle className="w-4 h-4" />;
        case "cancelled":
          return <XCircle className="w-4 h-4" />;
        case "completed":
          return <Package className="w-4 h-4" />;
        default:
          return <AlertCircle className="w-4 h-4" />;
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

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* ✅ COMPACT HEADER - Always visible */}
        <div
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleBookingDetails(booking.id)}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: Item info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {booking.item?.name || "[Item Name]"}
                </h3>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="text-gray-600">#{booking.id}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {new Date(booking.start_date).toLocaleDateString()} -{" "}
                  {new Date(booking.end_date).toLocaleDateString()}
                </span>
                {booking.total_price && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold text-indigo-600">
                      ₹{booking.total_price}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Status and expand button */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${getStatusColor(
                  booking.status
                )}`}
              >
                {getStatusIcon(booking.status)}
                {statusMap[booking.status]}
              </span>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* ✅ Quick Bill Status - Only when bill exists */}
          {booking.bill && booking.status !== "cancelled" && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Bill {booking.bill.bill_number}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border ${getBillStatusColor(
                    booking.bill.payment_status
                  )}`}
                >
                  {booking.bill.payment_status_display ||
                    booking.bill.payment_status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ✅ EXPANDABLE DETAILS */}
        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
            {/* ✅ BILLING DETAILS */}
            {booking.bill && booking.status !== "cancelled" && (
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                    Billing Information
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getBillStatusColor(
                      booking.bill.payment_status
                    )}`}
                  >
                    {booking.bill.payment_status === "paid" && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    {booking.bill.payment_status_display}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Invoice #</p>
                    <p className="font-semibold text-gray-900">
                      {booking.bill.bill_number}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="font-bold text-lg text-indigo-600">
                      ₹{parseFloat(booking.bill.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {booking.bill.payment_status === "paid" &&
                  booking.bill.paid_at && (
                    <div className="bg-green-50 rounded p-3 border border-green-200 mb-3">
                      <p className="text-xs text-green-700 font-semibold mb-1">
                        ✓ Payment Completed
                      </p>
                      <p className="text-sm text-gray-700">
                        {new Date(booking.bill.paid_at).toLocaleString()}
                      </p>
                      {booking.bill.payment_method_display && (
                        <p className="text-xs text-gray-600 mt-1">
                          Method: {booking.bill.payment_method_display}
                        </p>
                      )}
                    </div>
                  )}

                {/* Payment Actions */}
                {!isOwnerSection &&
                  booking.bill.payment_status === "pending" &&
                  booking.status === "confirmed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToBilling(booking.bill.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </button>
                  )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToBilling(booking.bill.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-300 px-4 py-2.5 rounded-lg font-semibold transition-all mt-2"
                >
                  <Receipt className="w-4 h-4" />
                  View Invoice
                </button>
              </div>
            )}

            {/* ✅ USER INFORMATION */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                {isOwnerSection ? "Renter Details" : "Owner Details"}
              </h4>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">
                  {isOwnerSection
                    ? booking.renter?.user_name ||
                      booking.renter?.username ||
                      "[Renter]"
                    : booking.owner?.user_name ||
                      booking.owner?.username ||
                      "[Owner]"}
                </p>
                {(isOwnerSection
                  ? booking.renter?.email
                  : booking.owner?.email) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>
                      {isOwnerSection
                        ? booking.renter.email
                        : booking.owner.email}
                    </span>
                  </div>
                )}
                {(isOwnerSection
                  ? booking.renter?.phone
                  : booking.owner?.phone) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>
                      {isOwnerSection
                        ? booking.renter.phone
                        : booking.owner.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ NOTES */}
            {(booking.renter_note || booking.owner_note) && (
              <div className="space-y-3">
                {booking.renter_note && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3">
                    <p className="text-xs text-yellow-700 font-semibold mb-1">
                      Renter's Note
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.renter_note}
                    </p>
                  </div>
                )}
                {booking.owner_note && (
                  <div className="bg-green-50 border-l-4 border-green-400 rounded p-3">
                    <p className="text-xs text-green-700 font-semibold mb-1">
                      Owner's Response
                    </p>
                    <p className="text-sm text-gray-800">
                      {booking.owner_note}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ✅ BOOKING HISTORY */}
            {booking.history && booking.history.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Activity Timeline
                </h4>
                <div className="space-y-2">
                  {booking.history
                    .slice()
                    .reverse()
                    .slice(0, 3)
                    .map((h, idx) => (
                      <div
                        key={h.id || idx}
                        className="flex items-start gap-3 bg-gray-50 rounded p-3"
                      >
                        <div className="bg-indigo-100 rounded-full p-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">
                              {h.previous_status} → {h.new_status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {h.timestamp
                                ? new Date(h.timestamp).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            By: {h.changed_by_name || h.changed_by || "System"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ✅ ACTION BUTTONS */}
            <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-200">
              {isOwnerSection && (
                <>
                  {booking.status === "pending" && (
                    <>
                      <button
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowOwnerNoteModal(true);
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <LoaderCircle className="animate-spin w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Accept
                      </button>
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" &&
                    booking.third_party_required && (
                      <button
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowLogisticsModal(true);
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <LoaderCircle className="animate-spin w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        Assign Logistics
                      </button>
                    )}

                  {(booking.status === "confirmed" ||
                    (booking.bill &&
                      booking.bill.payment_status === "pending" &&
                      booking.bill.payment_method === "cod")) && (
                    <button
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        completeBooking(booking.id);
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <LoaderCircle className="animate-spin w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Complete
                    </button>
                  )}

                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" && (
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                </>
              )}

              {!isOwnerSection && (
                <>
                  {booking.status === "accepted_by_owner" && booking.bill && (
                    <button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        renterConfirm(booking.id);
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <LoaderCircle className="animate-spin w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Confirm
                    </button>
                  )}

                  {booking.status === "confirmed" && (
                    <>
                      <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowExtendModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4" /> Extend
                      </button>
                      <button
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          returnItem(booking.id);
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <LoaderCircle className="animate-spin w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                        Return
                      </button>
                    </>
                  )}

                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" && (
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Order Management
          </h1>

          {/* ✅ TABS */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("owner")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "owner"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Package className="w-5 h-5" />
              My Items ({ownerBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("renter")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "renter"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              My Bookings ({renterBookings.length})
            </button>
          </div>

          {/* ✅ FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted_by_owner">Accepted by Owner</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ BOOKINGS LIST */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {displayBookings.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">
              No orders found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isOwnerSection={activeTab === "owner"}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ ALL MODALS (same as before, just keeping them compact) */}
      {showOwnerNoteModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Accept Booking</h3>
            <p className="text-gray-600 text-sm mb-4">
              Add an optional note for the renter.
              <span className="block mt-2 text-indigo-600 font-semibold">
                ✓ Bill will be created automatically
              </span>
            </p>
            <textarea
              placeholder="Optional note..."
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 min-h-24"
              value={ownerNote}
              onChange={(e) => setOwnerNote(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOwnerNoteModal(false);
                  setOwnerNote("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => ownerAccept(selectedBooking.id, ownerNote)}
                disabled={processingId === selectedBooking.id}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {processingId === selectedBooking.id
                  ? "Accepting..."
                  : "Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExtendModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Extend Rental Period</h3>
            <input
              type="number"
              min="1"
              placeholder="Number of days"
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4"
              value={extendDays}
              onChange={(e) => setExtendDays(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExtendModal(false);
                  setExtendDays("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={extendBooking}
                disabled={processingId === selectedBooking.id}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {processingId === selectedBooking.id
                  ? "Extending..."
                  : "Extend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogisticsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-600" />
              Assign Logistics
            </h3>
            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Provider Name *"
                className="w-full border-2 border-gray-300 rounded-lg p-3"
                value={logisticsProvider}
                onChange={(e) => setLogisticsProvider(e.target.value)}
              />
              <textarea
                placeholder="Additional Details"
                className="w-full border-2 border-gray-300 rounded-lg p-3 min-h-20"
                value={logisticsDetails}
                onChange={(e) => setLogisticsDetails(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogisticsModal(false);
                  setLogisticsProvider("");
                  setLogisticsDetails("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={assignLogistics}
                disabled={processingId === selectedBooking.id}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {processingId === selectedBooking.id
                  ? "Assigning..."
                  : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {selectedBooking.status === "pending" ? "Reject" : "Cancel"}{" "}
              Booking
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure? This action cannot be undone.
            </p>
            <textarea
              placeholder="Reason (optional)"
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 min-h-20"
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelNote("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={cancelBooking}
                disabled={processingId === selectedBooking.id}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {processingId === selectedBooking.id
                  ? selectedBooking.status === "pending"
                    ? "Rejecting..."
                    : "Cancelling..."
                  : selectedBooking.status === "pending"
                  ? "Reject"
                  : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
