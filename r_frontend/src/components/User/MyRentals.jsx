import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Edit,
  Eye,
  Loader2,
  Package,
  Star,
  UserCheck,
  ClipboardList,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function MyRentals() {
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsByItem, setRequestsByItem] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Get owned products
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view your rentals.");
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get("/api/my-items/", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setMyItems(res.data);
        console.log("My items:", res.data);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        toast.error("Failed to load your items.");
        setMyItems([]);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // Get rental requests for all items
  useEffect(() => {
    async function fetchRequests() {
      if (!myItems.length) return;

      let byItem = {};
      
      try {
        // Fetch all bookings
        const response = await axios.get("/api/bookings/", {
          headers: getAuthHeaders(),
        });

        const allBookings = response.data;
        console.log("All bookings:", allBookings);

        // Group bookings by item for items owned by current user
        myItems.forEach((item) => {
          const itemBookings = allBookings.filter(
            (booking) =>
              (booking.item === item.id || booking.item?.id === item.id) &&
              booking.status !== "cancelled" &&
              booking.status !== "completed"
          );
          byItem[item.id] = itemBookings;
        });

        setRequestsByItem(byItem);
        console.log("Requests by item:", byItem);
      } catch (err) {
        console.error("Error fetching requests:", err);
        // Initialize empty arrays for all items
        myItems.forEach((item) => {
          byItem[item.id] = [];
        });
        setRequestsByItem(byItem);
      }
    }

    fetchRequests();
  }, [myItems]);

  // Delete product
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeletingId(itemId);
    try {
      await axios.delete(`/api/items/${itemId}/`, {
        headers: getAuthHeaders(),
      });
      setMyItems((items) => items.filter((item) => item.id !== itemId));
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to delete item!";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  // Navigate to item detail page
  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  // Navigate to order management
  const handleViewRequests = () => {
    navigate("/orders");
  };

  // Get status color
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

  // Get status icon
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
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <BookOpen size={38} className="text-blue-500" />
                My Rentals & Listings
              </h1>
              <p className="text-zinc-500 text-lg">
                Manage your rental items, requests, and product details here.
              </p>
            </div>
            <button
              onClick={handleViewRequests}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <ClipboardList size={20} />
              View All Requests
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={38} className="animate-spin text-blue-500" />
          </div>
        ) : myItems.length === 0 ? (
          <div className="text-xl font-medium text-zinc-400 py-20 text-center flex flex-col gap-3 items-center bg-white rounded-2xl shadow-lg border border-zinc-100 p-12">
            <ClipboardList size={42} />
            <p>No products listed for rent yet.</p>
            <button
              onClick={() => navigate("/items/add")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItems.map((item) => {
              const primaryImage =
                item.images?.find((img) => img.is_primary)?.image_url ||
                item.images?.[0]?.image_url ||
                "/default-item.jpg";
              
              const itemRequests = requestsByItem[item.id] || [];
              const pendingRequests = itemRequests.filter(
                (req) => req.status === "pending"
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg border border-zinc-100 flex flex-col hover:shadow-xl transition-shadow"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-zinc-50 hover:bg-zinc-100 transition flex items-center justify-center rounded-t-2xl overflow-hidden group">
                    <img
                      src={primaryImage}
                      alt={item.name}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <div
                        className={`px-4 py-1 text-xs font-bold shadow rounded-full ${
                          item.availability_status === "available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.availability_status}
                      </div>
                      {pendingRequests.length > 0 && (
                        <div className="bg-orange-500 text-white px-3 py-1 text-xs font-bold shadow rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          {pendingRequests.length} Pending
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewItem(item.id)}
                      className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100"
                    >
                      <Eye size={32} className="text-white" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="inline-flex px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap ml-2">
                        {item.condition}
                      </span>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                      <Package size={18} className="text-zinc-400" />
                      {item.category?.name || "Uncategorized"}
                    </div>

                    <p className="mb-3 text-xs text-zinc-400 line-clamp-2">
                      {item.description || "No description available"}
                    </p>

                    <div className="flex justify-between items-center mt-auto mb-3">
                      <div>
                        <span className="text-lg text-blue-600 font-bold">
                          ₹{item.price_per_day}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          /day
                        </span>
                      </div>
                      <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded px-2 py-1 flex items-center gap-1">
                        <Star size={15} className="text-yellow-500 fill-yellow-500" />
                        {item.rating || "0"} ({item.total_ratings || 0})
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 my-3"></div>

                    {/* Rental Requests */}
                    <div className="mb-3">
                      <span className="font-semibold text-zinc-700 flex items-center gap-2 mb-2">
                        <UserCheck size={16} className="text-green-500" />
                        Rental Requests ({itemRequests.length})
                      </span>
                      <div className="ml-4">
                        {itemRequests.length === 0 ? (
                          <p className="text-zinc-400 text-xs italic">
                            No active requests yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {itemRequests.slice(0, 3).map((req) => (
                              <div
                                key={req.id}
                                className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-800">
                                    {req.renter?.user_name ||
                                      req.renter?.username ||
                                      "User"}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(
                                      req.status
                                    )}`}
                                  >
                                    {getStatusIcon(req.status)}
                                    {req.status.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(req.start_date).toLocaleDateString()}{" "}
                                  - {new Date(req.end_date).toLocaleDateString()}
                                </div>
                                <button
                                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                  onClick={() => navigate(`/item/${item.id}`)}
                                >
                                  View Details →
                                </button>
                              </div>
                            ))}
                            {itemRequests.length > 3 && (
                              <p className="text-xs text-gray-500 text-center mt-2">
                                Showing 3 of {itemRequests.length} requests
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-3 flex-1 flex gap-1 items-center justify-center font-bold transition-all shadow-md hover:shadow-lg"
                        onClick={() => navigate(`/items/${item.id}/edit`)}
                      >
                        <Edit size={18} /> Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 px-3 flex-1 flex gap-1 items-center justify-center font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />{" "}
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} /> Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}