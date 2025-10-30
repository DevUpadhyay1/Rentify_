import React, { useState, useEffect, useRef } from "react";
import { Heart, ArrowRight, Star, MapPin } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8000"; // Update to your API if needed

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef();
  const token = localStorage.getItem("token");

  const getAuthHeaders = () => 
    token ? { Authorization: `Bearer ${token}` } : {};

  // Show toast utility
  const showToast = (message) => {
    setToast({ message, visible: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast({ message: "", visible: false }),
      1500
    );
  };

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/wishlists/`, {
          headers: getAuthHeaders(),
        });
        // Fetch each related item (assuming wishlists includes items inline)
        setFavorites(res.data.map(w => ({ ...w.item, wishlistId: w.id })));
      } catch (e) {
        showToast("Unable to fetch favorites.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  // Remove from favorites
  const handleUnfavorite = async (wishlistId) => {
    try {
      await axios.delete(`${API_BASE}/api/wishlists/${wishlistId}/`, {
        headers: getAuthHeaders(),
      });
      setFavorites((prev) => prev.filter(fav => fav.wishlistId !== wishlistId));
      showToast("Item removed from wishlist");
    } catch (e) {
      showToast("Failed to remove favorite.");
    }
  };

  // Primary image helper
  const getPrimaryImageUrl = (item) =>
    item.images && item.images.length > 0
      ? (item.images.find((img) => img.is_primary) || item.images[0]).image_url
      : "/default-item.jpg";

  // Card UI, similar to LandingPage
  const FavoriteCard = ({ item }) => (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
      {/* Unfavorite Button */}
      <button
        type="button"
        title="Remove from Favorites"
        onClick={() => handleUnfavorite(item.wishlistId)}
        className="absolute top-3 left-3 z-10 bg-white/80 hover:bg-pink-200 rounded-full p-2 shadow-sm transition-colors text-pink-600"
      >
        <Heart fill="#f43f5e" size={22} />
      </button>
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={getPrimaryImageUrl(item)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 border border-blue-200">
          {item.category &&
            (typeof item.category === "object"
              ? item.category.name
              : item.category)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{item.location}</span>
        </div>
        <div className="text-xs text-zinc-400 mb-4">{item.description}</div>
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(item.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-semibold text-gray-700">
            {item.rating}
          </span>
          <span className="ml-1 text-sm text-gray-500">
            ({item.total_ratings || 0})
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="font-bold text-blue-600 text-2xl">
              ₹{item.price_per_day}
            </span>
            <span className="ml-1 text-gray-500 text-sm">/day</span>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group">
            Rent Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Toast message */}
      {toast.visible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg z-50 transition-all">
          {toast.message}
        </div>
      )}

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          My Wishlist
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading your favorites...
            </p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              No favorite items yet
            </p>
            <p className="text-gray-500 mb-6">
              Add items to your wishlist to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(item => (
              <FavoriteCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Favorite;
