import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  Smartphone,
  Sofa,
  Car,
  Dumbbell,
  PartyPopper,
  Wrench,
  Camera,
  Music,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Heart,
  Loader2,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Edit,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast as toastify } from "react-toastify";

const API_BASE_URL = "http://127.0.0.1:8000";

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    color: "blue",
    subcategories: ["Laptops", "Cameras", "Smartphones", "Audio"],
  },
  {
    name: "Furniture",
    icon: Sofa,
    color: "green",
    subcategories: ["Sofas", "Beds", "Chairs"],
  },
  {
    name: "Vehicles",
    icon: Car,
    color: "red",
    subcategories: ["Cars", "Bikes", "Electric"],
  },
  {
    name: "Sports",
    icon: Dumbbell,
    color: "purple",
    subcategories: ["Equipment", "Outdoor", "Team Sports"],
  },
  {
    name: "Events",
    icon: PartyPopper,
    color: "pink",
    subcategories: ["Sound Systems", "Decoration", "Lighting"],
  },
  {
    name: "Tools",
    icon: Wrench,
    color: "yellow",
    subcategories: ["Hand Tools", "Power Tools"],
  },
  {
    name: "Cameras",
    icon: Camera,
    color: "indigo",
    subcategories: ["DSLR", "Mirrorless", "GoPro"],
  },
  {
    name: "Music",
    icon: Music,
    color: "orange",
    subcategories: ["Guitars", "Keyboards", "DJ", "Speakers"],
  },
];

const colorClassMap = {
  blue: "bg-blue-600",
  green: "bg-green-600",
  red: "bg-red-600",
  purple: "bg-purple-600",
  pink: "bg-pink-600",
  yellow: "bg-yellow-600",
  indigo: "bg-indigo-600",
  orange: "bg-orange-600",
};

const iconTextColorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  yellow: "text-yellow-600",
  indigo: "text-indigo-600",
  orange: "text-orange-600",
};

const AVAILABILITY_FILTERS = {
  ALL: "all",
  AVAILABLE: "available",
  RENTED: "rented",
};

const LandingPage = () => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState(
    AVAILABILITY_FILTERS.ALL
  );

  // Data States
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState("");
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Pagination States
  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Favorites States
  const [favoriteMap, setFavoriteMap] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState({});

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Current user ID
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const locationRef = useRef(null);

  // Filter cities based on search
  const filteredCities = cities.filter((city) => {
    const cityName = typeof city === "object" ? city.city : city;
    return cityName.toLowerCase().includes(locationSearch.toLowerCase());
  });

  // Get current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setCurrentUserId(null);
        setCurrentUserLoading(false);
        return;
      }

      setCurrentUserLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data.id);
      } catch (e) {
        console.error("Error fetching user:", e);
        setCurrentUserId(null);

        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          toastify.warning("Session expired. Please login again.");
        }
      } finally {
        setCurrentUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cities using smart search API
  const fetchCities = useCallback(async (query = "") => {
    setCitiesLoading(true);
    try {
      const endpoint = query
        ? `${API_BASE_URL}/api/locations/search/?q=${query}`
        : `${API_BASE_URL}/api/locations/available-cities/`;

      const res = await axios.get(endpoint);
      setCities(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  // Debounced location search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch.length >= 2) {
        fetchCities(locationSearch);
      } else if (locationSearch.length === 0) {
        fetchCities();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationSearch, fetchCities]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (location) count++;
    if (selectedCategory !== "All") count++;
    if (selectedSubCategory) count++;
    if (priceRange[1] < 10000) count++;
    if (selectedRating > 0) count++;
    if (availabilityFilter !== AVAILABILITY_FILTERS.ALL) count++;
    setActiveFiltersCount(count);
  }, [
    location,
    selectedCategory,
    selectedSubCategory,
    priceRange,
    selectedRating,
    availabilityFilter,
  ]);

  // Fetch all products
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setSearchError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/`);
      setAllItems(res.data);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setAllItems([]);
      setItems([]);
      setSearchError("Failed to load products. Please try again.");
      toastify.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filters with pagination
  const applyFilters = useCallback(() => {
    let filtered = [...allItems];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          (typeof item.category === "object"
            ? item.category.name.toLowerCase().includes(query)
            : item.category?.toLowerCase().includes(query))
      );
    }

    // Location filter (exact match)
    if (location) {
      const searchLocation = location.toLowerCase().trim();
      filtered = filtered.filter(
        (item) => item.location?.toLowerCase().trim() === searchLocation
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => {
        const itemCategory =
          typeof item.category === "object"
            ? item.category.name
            : item.category;
        return itemCategory === selectedCategory;
      });
    }

    // Subcategory filter
    if (selectedSubCategory) {
      filtered = filtered.filter((item) => {
        const itemSubCategory =
          typeof item.subcategory === "object"
            ? item.subcategory.name
            : item.subcategory;
        return itemSubCategory === selectedSubCategory;
      });
    }

    // Price filter
    filtered = filtered.filter(
      (item) =>
        item.price_per_day >= priceRange[0] &&
        item.price_per_day <= priceRange[1]
    );

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(
        (item) => (item.rating || 0) >= selectedRating
      );
    }

    // Availability filter
    if (availabilityFilter === AVAILABILITY_FILTERS.AVAILABLE) {
      filtered = filtered.filter((item) => item.is_available === true);
    } else if (availabilityFilter === AVAILABILITY_FILTERS.RENTED) {
      filtered = filtered.filter((item) => item.is_available === false);
    }

    // Sorting
    if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price_per_day - a.price_per_day);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setItems(filtered);

    // Reset pagination and set initial displayed items
    setCurrentPage(1);
    setDisplayedItems(filtered.slice(0, itemsPerPage));
    setHasMore(filtered.length > itemsPerPage);
  }, [
    allItems,
    searchQuery,
    location,
    selectedCategory,
    selectedSubCategory,
    priceRange,
    selectedRating,
    sortBy,
    availabilityFilter,
    itemsPerPage,
  ]);

  // Load more items function
  const loadMoreItems = () => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * itemsPerPage;

    const newDisplayedItems = items.slice(0, endIndex);
    setDisplayedItems(newDisplayedItems);
    setCurrentPage(nextPage);
    setHasMore(endIndex < items.length);
  };

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/wishlists/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favIds = res.data.map((w) => w.item?.id || w.item);
        setFavorites(favIds);
        const favMap = {};
        res.data.forEach((w) => {
          const itemId = w.item?.id || w.item;
          favMap[itemId] = w.id;
        });
        setFavoriteMap(favMap);
      } catch (e) {
        console.error("Error fetching favorites:", e);
      }
    };
    fetchFavorites();
  }, [token]);

  // Initial fetch
  useEffect(() => {
    fetchAllProducts();
    fetchCities();
  }, [fetchAllProducts, fetchCities]);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    applyFilters();
  };

  // Reset filters
  const resetAllFilters = () => {
    setSearchQuery("");
    setLocation("");
    setLocationSearch("");
    setSelectedCategory("All");
    setSelectedSubCategory("");
    setPriceRange([0, 10000]);
    setSelectedRating(0);
    setSortBy("");
    setAvailabilityFilter(AVAILABILITY_FILTERS.ALL);
    setCurrentPage(1);
  };

  // Handle favorite toggle
  const handleFavorite = async (itemId) => {
    if (!token) {
      toastify.warning("Please log in to add items to your wishlist");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (favoritesLoading[itemId]) return;

    setFavoritesLoading((prev) => ({ ...prev, [itemId]: true }));
    const isFav = favorites.includes(itemId);

    try {
      if (isFav) {
        const wishlistId = favoriteMap[itemId];
        await axios.delete(`${API_BASE_URL}/api/wishlists/${wishlistId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((favs) => favs.filter((id) => id !== itemId));
        setFavoriteMap((map) => {
          const newMap = { ...map };
          delete newMap[itemId];
          return newMap;
        });
        toastify.success("Removed from wishlist");
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/api/wishlists/`,
          { item_id: itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((favs) => [...favs, itemId]);
        if (res?.data?.id) {
          setFavoriteMap((map) => ({ ...map, [itemId]: res.data.id }));
        }
        toastify.success("Added to wishlist");
      }
    } catch (e) {
      console.error("Favorite error:", e);
      toastify.error("Failed to update wishlist");
    } finally {
      setFavoritesLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const getPrimaryImageUrl = (item) => {
    try {
      if (!item || !item.images || item.images.length === 0) {
        return "https://via.placeholder.com/400x300?text=No+Image";
      }

      const primaryImage = item.images.find((img) => img.is_primary);
      const imageUrl = primaryImage
        ? primaryImage.image_url
        : item.images[0]?.image_url;

      if (
        !imageUrl ||
        imageUrl.trim() === "" ||
        imageUrl === "data:;base64,="
      ) {
        return "https://via.placeholder.com/400x300?text=No+Image";
      }

      return imageUrl;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return "https://via.placeholder.com/400x300?text=No+Image";
    }
  };

  const isOwner = (item) => {
    try {
      if (currentUserLoading || !currentUserId || !item) return false;

      const ownerId =
        typeof item.owner === "object" ? item.owner.id : item.owner;
      return ownerId === currentUserId;
    } catch (error) {
      console.error("Error checking owner:", error);
      return false;
    }
  };

  // ✅ FIXED ProductCard Component - No Overlapping Badges
  const ProductCard = ({ item }) => {
    if (!item || !item.id) {
      console.error("Invalid item data:", item);
      return null;
    }

    try {
      const itemIsAvailable =
        item.is_available === true ||
        item.is_available === "true" ||
        item.is_available === 1;

      const userIsOwner = isOwner(item);

      const itemName = item.name || "Unnamed Item";
      const itemLocation = item.location || "Location not specified";
      const itemDescription = item.description || "No description available";
      const itemPrice = item.price_per_day || 0;

      // ✅ FIXED: Ensure rating is always a number
      const rawRating = item.average_rating || item.rating || 0;
      const itemRating =
        typeof rawRating === "number" ? rawRating : parseFloat(rawRating) || 0;

      // ✅ FIXED: Ensure total ratings is always a number
      const rawTotalRatings = item.total_reviews || item.total_ratings || 0;
      const itemTotalRatings =
        typeof rawTotalRatings === "number"
          ? rawTotalRatings
          : parseInt(rawTotalRatings) || 0;

      const itemCategory =
        item.category && typeof item.category === "object"
          ? item.category.name
          : item.category || "Uncategorized";

      return (
        <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
          {/* Top Left Corner - Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            {currentUserLoading ? (
              <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading...
              </div>
            ) : userIsOwner ? (
              <div className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Your Item
              </div>
            ) : !itemIsAvailable ? (
              <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                Currently Rented
              </div>
            ) : null}
          </div>

          {/* Top Right Corner - Wishlist Button */}
          {!currentUserLoading && !userIsOwner && (
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(item.id);
                }}
                disabled={favoritesLoading[item.id]}
                className={`bg-white/90 backdrop-blur-sm hover:bg-pink-50 rounded-full p-2.5 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  favorites.includes(item.id)
                    ? "text-pink-600 scale-110"
                    : "text-gray-400 hover:text-pink-500"
                }`}
              >
                {favoritesLoading[item.id] ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart
                    fill={favorites.includes(item.id) ? "currentColor" : "none"}
                    className="w-5 h-5"
                  />
                )}
              </button>
            </div>
          )}

          {/* Item Image */}
          <div
            className="relative h-56 overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/items/${item.id}`)}
          >
            <img
              src={getPrimaryImageUrl(item)}
              alt={itemName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Bottom Left - Available Badge */}
            {!currentUserLoading && itemIsAvailable && !userIsOwner && (
              <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available Now
              </div>
            )}

            {/* Bottom Right - Category Badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 border border-blue-200 shadow-md">
              {itemCategory}
            </div>
          </div>

          {/* Item Details */}
          <div className="p-5">
            <h3
              className="font-bold text-lg mb-2 text-gray-900 truncate group-hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => navigate(`/items/${item.id}`)}
            >
              {itemName}
            </h3>

            <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{itemLocation}</span>
            </div>

            <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
              {itemDescription}
            </p>

            {/* ✅ FIXED: Rating Display with proper number handling */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(itemRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {itemRating > 0 ? itemRating.toFixed(1) : "0.0"}
              </span>
              <span className="ml-1 text-sm text-gray-500">
                ({itemTotalRatings}{" "}
                {itemTotalRatings === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="font-bold text-blue-600 text-2xl">
                  ₹{itemPrice}
                </span>
                <span className="ml-1 text-gray-500 text-sm">/day</span>
              </div>

              {/* Action Buttons */}
              {currentUserLoading ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium text-sm cursor-wait flex items-center gap-1.5"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading...
                </button>
              ) : userIsOwner ? (
                <button
                  onClick={() => navigate(`/dashboard/my-listings`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Manage
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/items/${item.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 group/btn"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering ProductCard:", error, item);
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 text-sm">Error loading item</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 drop-shadow-lg">
            Rent Anything, Anytime
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 font-light max-w-3xl mx-auto">
            Your marketplace for renting electronics, furniture, vehicles & more
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="bg-white rounded-2xl p-3 shadow-2xl max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Input */}
                <div className="flex items-center flex-1 relative group">
                  <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    className="w-full py-4 pl-12 pr-4 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Location Dropdown */}
                <div
                  ref={locationRef}
                  className="flex items-center relative md:w-64 group"
                >
                  <MapPin className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder={location || "Search location..."}
                    className="w-full py-4 pl-12 pr-10 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                  />
                  <ChevronDown className="absolute right-4 w-5 h-5 text-gray-400 pointer-events-none" />

                  {/* Location Dropdown */}
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setLocation("");
                          setLocationSearch("");
                          setShowLocationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 border-b font-medium"
                      >
                        🌍 All Locations
                      </button>

                      {citiesLoading ? (
                        <div className="px-4 py-3 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading cities...
                        </div>
                      ) : filteredCities.length > 0 ? (
                        filteredCities.map((cityObj, idx) => {
                          const cityName =
                            typeof cityObj === "object"
                              ? cityObj.city
                              : cityObj;
                          const itemCount =
                            typeof cityObj === "object" ? cityObj.count : null;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setLocation(cityName);
                                setLocationSearch("");
                                setShowLocationDropdown(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 transition-colors flex items-center justify-between"
                            >
                              <span>🏙️ {cityName}</span>
                              {itemCount && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {itemCount} items
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No cities found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Search
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{allItems.length}+</div>
              <div className="text-blue-200 text-sm">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{cities.length}+</div>
              <div className="text-blue-200 text-sm">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-blue-200 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const bgColor = colorClassMap[cat.color];
              const textColor = iconTextColorMap[cat.color];

              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubCategory("");
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedCategory === cat.name
                      ? `${bgColor} text-white border-transparent shadow-lg scale-105`
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Icon
                    className={`w-10 h-10 mx-auto mb-3 ${
                      selectedCategory === cat.name ? "text-white" : textColor
                    }`}
                  />
                  <p className="text-sm font-semibold text-center">
                    {cat.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters & Products Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={AVAILABILITY_FILTERS.ALL}>All Items</option>
              <option value={AVAILABILITY_FILTERS.AVAILABLE}>
                Available Only
              </option>
              <option value={AVAILABILITY_FILTERS.RENTED}>Rented Out</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort By</option>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              Showing {displayedItems.length} of {items.length} items
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Minimum Rating
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all ${
                          selectedRating === rating
                            ? "bg-yellow-400 border-yellow-500 text-white"
                            : "border-gray-300 hover:border-yellow-400"
                        }`}
                      >
                        {rating}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Filter */}
                {selectedCategory !== "All" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Subcategory
                    </label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Subcategories</option>
                      {categories
                        .find((c) => c.name === selectedCategory)
                        ?.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : searchError ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{searchError}</p>
              <button
                onClick={fetchAllProducts}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                No items found matching your criteria
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMoreItems}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 group"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Load More Products
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {items.length - displayedItems.length} more
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Rentify?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Protected payments and verified users
              </p>
            </div>
            <div className="text-center p-6">
              <Clock className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Flexible Rentals</h3>
              <p className="text-gray-600">Rent for days, weeks, or months</p>
            </div>
            <div className="text-center p-6">
              <Award className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All items verified for quality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
