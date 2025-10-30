import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tag,
  Star,
  TrendingUp,
  Package,
  ChevronDown,
  Filter,
  Search,
  MapPin,
  Grid3x3,
  List,
  X,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Posters array for randomization
const posters = ["/public/Rentify.png"];

function useRandomPoster() {
  const [poster, setPoster] = useState("");
  useEffect(() => {
    setPoster(posters[Math.floor(Math.random() * posters.length)]);
  }, []);
  return poster;
}

function ItemCard({ item, navigate }) {
  const imagesArr =
    item.images && Array.isArray(item.images)
      ? item.images
      : item.images
      ? [item.images]
      : [];

  const primaryImage =
    imagesArr.find((img) => img.is_primary)?.image_url ||
    imagesArr[0]?.image_url ||
    "/default-item.jpg";

  // ✅ Status badge styling based on availability
  const getStatusBadge = (status) => {
    const statusMap = {
      AVAILABLE: {
        bg: "from-green-500 to-emerald-600",
        text: "Available",
        dot: "bg-green-500",
      },
      RENTED: {
        bg: "from-orange-500 to-red-500",
        text: "Rented",
        dot: "bg-orange-500",
      },
      MAINTENANCE: {
        bg: "from-yellow-500 to-orange-500",
        text: "Maintenance",
        dot: "bg-yellow-500",
      },
      UNAVAILABLE: {
        bg: "from-gray-500 to-gray-600",
        text: "Unavailable",
        dot: "bg-gray-500",
      },
    };

    const badge = statusMap[status] || statusMap["UNAVAILABLE"];

    return (
      <div
        className={`absolute top-3 right-3 z-10 bg-gradient-to-r ${badge.bg} text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5`}
      >
        <span
          className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`}
        ></span>
        {badge.text}
      </div>
    );
  };

  return (
    <div className="relative group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {getStatusBadge(item.availability_status)}

      {/* Image Section */}
      <div className="w-full h-56 overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-50">
        <img
          src={primaryImage}
          alt={item.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => (e.target.src = "/default-item.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 text-xs font-semibold shadow-lg">
          <Package size={14} className="text-blue-600" />
          <span className="text-gray-700 capitalize">{item.condition}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {item.name}
          </h3>

          {/* ✅ Fixed: Price styling like landing page */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{item.price_per_day}
            </span>
            <span className="text-sm text-gray-500 font-medium">/day</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <MapPin size={14} className="text-gray-400" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg px-2.5 py-1.5">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-800">
                {item.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({item.total_ratings} reviews)
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/items/${item.id}/rent`)}
          disabled={item.availability_status !== "AVAILABLE"}
          className={`mt-5 w-full font-bold py-3 rounded-lg transition-all transform ${
            item.availability_status === "AVAILABLE"
              ? "bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {item.availability_status === "AVAILABLE"
            ? "View Details →"
            : "Not Available"}
        </button>
      </div>
    </div>
  );
}

export default function Product() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const randomPoster = useRandomPoster();
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => {
        setCategories(res.data);
        setAllCategories(res.data);
      })
      .catch(() => {
        setCategories([]);
        setAllCategories([]);
      });
  }, []);

  // Filter categories based on search
  useEffect(() => {
    if (categorySearch.trim()) {
      const filtered = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setCategories(filtered);
    } else {
      setCategories(allCategories);
    }
  }, [categorySearch, allCategories]);

  // Fetch subcategories when category changes
  useEffect(() => {
    setSelectedSubCategory(null);
    setItems([]);

    if (selectedCategory) {
      axios
        .get(
          `http://127.0.0.1:8000/api/subcategories/?category=${selectedCategory.id}`
        )
        .then((res) => {
          setSubcategories(res.data);

          // If no subcategories, fetch items directly
          if (!res.data || res.data.length === 0) {
            fetchItems({ category: selectedCategory.id });
          }
        })
        .catch(() => {
          setSubcategories([]);
        });
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  // Fetch items when subcategory changes
  useEffect(() => {
    if (selectedSubCategory) {
      fetchItems({ subcategory: selectedSubCategory.id });
    }
  }, [selectedSubCategory]);

  // ✅ Fixed: Fetch items function with proper filtering
  const fetchItems = (params) => {
    setLoading(true);
    const queryParams = new URLSearchParams(params).toString();

    console.log("🔍 Fetching items with params:", params);

    axios
      .get(`http://127.0.0.1:8000/api/items/?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("✅ Fetched items:", res.data);

        // ✅ Client-side filtering for extra safety
        let filteredData = res.data;

        if (params.subcategory) {
          filteredData = res.data.filter(
            (item) =>
              item.subcategory?.id === parseInt(params.subcategory) ||
              item.subcategory === parseInt(params.subcategory)
          );
          console.log(
            `🔍 Filtered ${filteredData.length} items for subcategory ${params.subcategory}`
          );
        } else if (params.category) {
          filteredData = res.data.filter(
            (item) =>
              item.category?.id === parseInt(params.category) ||
              item.category === parseInt(params.category)
          );
          console.log(
            `🔍 Filtered ${filteredData.length} items for category ${params.category}`
          );
        }

        setItems(filteredData);
      })
      .catch((err) => {
        console.error("❌ Error fetching items:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  // Filter items by search query
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showItems =
    selectedSubCategory || (selectedCategory && subcategories.length === 0);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSearchQuery("");
    setCategorySearch("");
    setItems([]);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={randomPoster}
          alt="Marketplace Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-pink-900/70">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400 animate-pulse" />
                <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                  Trending Products
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                Discover & Rent
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                  Amazing Products
                </span>
              </h1>
              <p className="text-xl text-blue-100 font-light">
                Browse thousands of items. Rent what you need. Save money & the
                planet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Left: Category Search & Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
              {/* Category Search */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative min-w-[220px]">
                <select
                  value={selectedCategory?.id || ""}
                  onChange={(e) => {
                    const cat = categories.find(
                      (c) => c.id === parseInt(e.target.value)
                    );
                    setSelectedCategory(cat || null);
                  }}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-semibold text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {/* Subcategory Dropdown */}
              {subcategories.length > 0 && (
                <div className="relative min-w-[220px]">
                  <select
                    value={selectedSubCategory?.id || ""}
                    onChange={(e) => {
                      const subcat = subcategories.find(
                        (s) => s.id === parseInt(e.target.value)
                      );
                      setSelectedSubCategory(subcat || null);
                    }}
                    className="w-full appearance-none bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg px-4 py-3 pr-10 text-sm font-semibold text-gray-800 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <Layers className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Right: Product Search & View Mode */}
            <div className="flex gap-3 w-full lg:w-auto items-center">
              {/* Product Search */}
              {showItems && (
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Clear Filters */}
              {(selectedCategory ||
                selectedSubCategory ||
                searchQuery ||
                categorySearch) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all"
                >
                  <X size={16} />
                  Clear
                </button>
              )}

              {/* View Mode Toggle */}
              {showItems && (
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Grid View"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedSubCategory) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">
                Active Filters:
              </span>
              {selectedCategory && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <span>{selectedCategory.name}</span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {selectedSubCategory && (
                <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                  <span>{selectedSubCategory.name}</span>
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-10 pb-32">
        {/* Products Section */}
        {showItems ? (
          <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  {selectedSubCategory?.name ||
                    selectedCategory?.name ||
                    "All Products"}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "product" : "products"}{" "}
                  available
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent"></div>
                  <span className="font-bold text-sm">
                    Loading amazing products...
                  </span>
                </div>
              )}
            </div>

            {/* Items Grid/List */}
            <div
              className={`grid gap-7 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredItems.length > 0
                ? filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} navigate={navigate} />
                  ))
                : !loading && (
                    <div className="col-span-full text-center py-24">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-2xl text-gray-700 font-bold mb-2">
                        No products found
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchQuery
                          ? "Try adjusting your search terms"
                          : subcategories.length > 0
                          ? "Select a subcategory to view products"
                          : "Try selecting a different category"}
                      </p>
                    </div>
                  )}
            </div>
          </section>
        ) : (
          /* Category Selection Prompt */
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 mb-8 shadow-xl">
              <Filter className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Choose a Category to Get Started
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Select a category from the dropdown above or search for specific
              categories to browse available products for rent
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate("/items/add")}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl text-white rounded-full px-8 py-4 flex items-center gap-3 hover:scale-110 transition-all font-black group"
        >
          <Tag
            size={22}
            className="group-hover:rotate-12 transition-transform"
          />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
}
