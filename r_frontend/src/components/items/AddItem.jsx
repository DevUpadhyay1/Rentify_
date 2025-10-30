import React, { useEffect, useState, useRef } from "react";
import {
  PlusCircle,
  Tag,
  FolderOpen,
  FilePlus,
  Image as LucideImage,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  MapPin,
  Calendar,
  Info,
  Sparkles,
  Package,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ API Base URL
const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const conditionChoices = [
  {
    value: "new",
    label: "🌟 Brand New",
    desc: "Never used, in original packaging",
  },
  {
    value: "like_new",
    label: "✨ Like New",
    desc: "Barely used, excellent condition",
  },
  { value: "good", label: "👍 Good", desc: "Used but well maintained" },
  { value: "fair", label: "👌 Fair", desc: "Shows signs of use" },
  { value: "poor", label: "🔧 Poor", desc: "Heavily used, may need repair" },
];

export default function AddItem() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image_file: null,
  });
  const [newSubcategory, setNewSubcategory] = useState({ name: "" });
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_per_day: "",
    deposit_required: "",
    minimum_rental_days: 1,
    maximum_rental_days: 30,
    location: "",
    condition: "new",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add items");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch categories at mount
  useEffect(() => {
    api
      .get("/categories/?ordering=name")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });
  }, []);

  // Fetch subcategories for selected category
  useEffect(() => {
    if (category) {
      api
        .get(`/subcategories/?category=${category}`)
        .then((res) => setSubcategories(res.data))
        .catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
    setSubcategory("");
    setShowAddSubcategory(false);
  }, [category]);

  useEffect(() => {
    if (category) setShowAddCategory(false);
  }, [category]);

  useEffect(() => {
    if (subcategory) setShowAddSubcategory(false);
  }, [subcategory]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", newCategory.name);
      data.append("description", newCategory.description);
      if (newCategory.image_file)
        data.append("image_file", newCategory.image_file);

      const res = await api.post("/categories/", data);
      setCategories([res.data, ...categories]);
      setFeedback({ type: "success", msg: "Category added successfully!" });
      setCategory(res.data.id);
      setNewCategory({ name: "", description: "", image_file: null });
      setCategoryImagePreview(null);
      setShowAddCategory(false);
      toast.success("Category added successfully!");
    } catch (err) {
      console.error("Category error:", err);
      const errorMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        "Failed to add category.";
      setFeedback({ type: "error", msg: errorMsg });
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategory.name) {
      toast.error("Subcategory name is required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/subcategories/", {
        name: newSubcategory.name,
        category_id: category,
      });
      setSubcategories([res.data, ...subcategories]);
      setFeedback({ type: "success", msg: "Subcategory added successfully!" });
      setSubcategory(res.data.id);
      setNewSubcategory({ name: "" });
      setShowAddSubcategory(false);
      toast.success("Subcategory added successfully!");
    } catch (err) {
      console.error("Subcategory error:", err);
      const errorMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        "Failed to add subcategory.";
      setFeedback({ type: "error", msg: errorMsg });
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const onCategoryImageChange = (e) => {
    const file = e.target.files[0];
    setNewCategory((prev) => ({ ...prev, image_file: file }));
    setCategoryImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onFieldChange = (e) => {
    let { name, value } = e.target;
    if (name === "minimum_rental_days" || name === "maximum_rental_days")
      value = Number(value);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", msg: "" });

    try {
      // Validate required fields
      if (
        !form.name ||
        !form.description ||
        !form.price_per_day ||
        !form.location
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Create item first
      const itemPayload = {
        name: form.name,
        description: form.description,
        price_per_day: parseFloat(form.price_per_day),
        deposit_required: parseFloat(form.deposit_required) || 0,
        minimum_rental_days: form.minimum_rental_days,
        maximum_rental_days: form.maximum_rental_days,
        location: form.location,
        condition: form.condition,
        category_id: category,
        subcategory_id: subcategory || null,
      };

      console.log("Creating item with payload:", itemPayload);
      const res = await api.post("/items/", itemPayload);
      const itemId = res.data.id;
      console.log("Item created with ID:", itemId);

      // Upload images one by one
      if (form.images && form.images.length > 0) {
        toast.info(`Uploading ${form.images.length} images...`);

        for (let i = 0; i < form.images.length; i++) {
          const img = form.images[i];
          const imgFormData = new FormData();
          imgFormData.append("item", itemId);
          imgFormData.append("image_file", img);
          imgFormData.append("is_primary", i === 0); // First image is primary

          console.log(`Uploading image ${i + 1}/${form.images.length}`);

          try {
            await api.post("/item-images/", imgFormData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log(`Image ${i + 1} uploaded successfully`);
          } catch (imgErr) {
            console.error(`Failed to upload image ${i + 1}:`, imgErr);
            toast.warning(`Failed to upload image ${i + 1}`);
          }
        }
      }

      setFeedback({ type: "success", msg: "Item listed successfully! 🎉" });
      toast.success("Item listed successfully! 🎉");

      // Reset form
      setForm({
        name: "",
        description: "",
        price_per_day: "",
        deposit_required: "",
        minimum_rental_days: 1,
        maximum_rental_days: 30,
        location: "",
        condition: "new",
        images: [],
      });
      setImagePreviews([]);
      setCategory("");
      setSubcategory("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Redirect to my items page
      setTimeout(() => {
        navigate("/my-rentals");
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        Object.values(err.response?.data || {}).flat()[0] ||
        "Failed to list item. Please check your inputs and try again.";
      setFeedback({ type: "error", msg: errorMsg });
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ✨ Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            List Your Product
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your items with thousands of renters and start earning today
          </p>
        </div>

        {/* ✅ Success/Error Alert */}
        {feedback.msg && (
          <div
            className={`mb-8 rounded-2xl shadow-xl border-2 overflow-hidden animate-in fade-in slide-in-from-top-4 ${
              feedback.type === "success"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
            }`}
          >
            <div className="flex items-start gap-4 p-6">
              {feedback.type === "success" ? (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
              ) : (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              )}
              <div className="flex-1">
                <h3
                  className={`font-bold text-lg mb-1 ${
                    feedback.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {feedback.type === "success" ? "Success!" : "Oops! Error"}
                </h3>
                <p
                  className={`text-sm ${
                    feedback.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {feedback.msg}
                </p>
              </div>
              <button
                onClick={() => setFeedback({ type: "", msg: "" })}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 📋 Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 🏷️ Category & Subcategory Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Category Selection
                </h2>
                <p className="text-sm text-gray-500">
                  Choose where your product belongs
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <select
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-700 font-medium outline-none transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 transition-all"
                    onClick={() => setShowAddCategory((v) => !v)}
                    title="Add category"
                  >
                    <Tag size={20} />
                  </button>
                </div>

                {/* Add Category Panel */}
                {showAddCategory && (
                  <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        New Category
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <input
                        placeholder="Category name"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none"
                        required
                      />
                      <input
                        placeholder="Description (optional)"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none"
                      />
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onCategoryImageChange}
                          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 file:font-semibold hover:file:bg-blue-200"
                        />
                        {categoryImagePreview && (
                          <img
                            src={categoryImagePreview}
                            alt="Preview"
                            className="h-12 w-12 rounded-lg object-cover border-2 border-blue-200"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <FilePlus size={18} />
                            Add Category
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subcategory */}
              {category && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subcategory{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="flex gap-3">
                    <select
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-gray-700 font-medium outline-none transition-all"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 transition-all"
                      onClick={() => setShowAddSubcategory((v) => !v)}
                      title="Add subcategory"
                    >
                      <FolderOpen size={20} />
                    </button>
                  </div>

                  {showAddSubcategory && (
                    <div className="mt-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-800">
                          New Subcategory
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowAddSubcategory(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <input
                          placeholder="Subcategory name"
                          value={newSubcategory.name}
                          onChange={(e) =>
                            setNewSubcategory({ name: e.target.value })
                          }
                          className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleAddSubcategory}
                          disabled={loading}
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <FilePlus size={16} />
                          )}
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 📝 Product Details (Only show if category selected) */}
          {category && (
            <>
              {/* Basic Info Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Product Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Tell us about your item
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      placeholder="e.g., Canon EOS 5D Mark IV Camera"
                      value={form.name}
                      onChange={onFieldChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-gray-700 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Describe your product features, condition, and what makes it special..."
                      value={form.description}
                      onChange={onFieldChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-gray-700 outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-purple-600" />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      placeholder="City, State"
                      value={form.location}
                      onChange={onFieldChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-gray-700 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {conditionChoices.map((opt) => (
                        <label
                          key={opt.value}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            form.condition === opt.value
                              ? "border-purple-500 bg-purple-50 ring-4 ring-purple-100"
                              : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="condition"
                            value={opt.value}
                            checked={form.condition === opt.value}
                            onChange={onFieldChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <p className="font-bold text-gray-800 mb-1">
                              {opt.label}
                            </p>
                            <p className="text-xs text-gray-500">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 💰 Pricing Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <IndianRupee className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Pricing & Terms
                    </h2>
                    <p className="text-sm text-gray-500">
                      Set your rental rates
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Price per Day */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Daily Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="price_per_day"
                        min={1}
                        step="0.01"
                        placeholder="100"
                        value={form.price_per_day}
                        onChange={onFieldChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-700 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Deposit */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Security Deposit (₹)
                      <Info
                        size={14}
                        className="text-gray-400"
                        title="Refundable amount"
                      />
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="deposit_required"
                        min={0}
                        step="0.01"
                        placeholder="500"
                        value={form.deposit_required}
                        onChange={onFieldChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-700 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Min Days */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-green-600" />
                      Minimum Rental Days
                    </label>
                    <input
                      type="number"
                      name="minimum_rental_days"
                      min={1}
                      max={form.maximum_rental_days || 30}
                      value={form.minimum_rental_days}
                      onChange={onFieldChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-700 outline-none transition-all"
                    />
                  </div>

                  {/* Max Days */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-green-600" />
                      Maximum Rental Days
                    </label>
                    <input
                      type="number"
                      name="maximum_rental_days"
                      min={form.minimum_rental_days || 1}
                      max={90}
                      value={form.maximum_rental_days}
                      onChange={onFieldChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-gray-700 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 📸 Images Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                    <LucideImage className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Product Images
                    </h2>
                    <p className="text-sm text-gray-500">
                      Upload high-quality photos (first image will be primary)
                    </p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                      <Upload className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Click to upload images
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        PNG, JPG, WEBP, GIF (max 5MB each)
                      </p>
                      <p className="text-blue-600 font-semibold">
                        {form.images.length} image(s) selected
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                            Primary
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                        <p className="text-xs text-gray-600 mt-2 truncate text-center">
                          {form.images[idx]?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🚀 Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl text-xl font-black shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={28} className="animate-spin" />
                    Listing Your Product...
                  </>
                ) : (
                  <>
                    <Sparkles size={28} />
                    List Your Product
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
