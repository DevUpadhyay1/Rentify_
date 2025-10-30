import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, Image as LucideImage, X, Edit } from "lucide-react";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    subcategory_id: "",
    price_per_day: "",
    deposit_required: "",
    minimum_rental_days: 1,
    maximum_rental_days: 30,
    location: "",
    condition: "new",
    images: [], // for new uploads
  });
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Fetch item data and categories on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`http://127.0.0.1:8000/api/items/${id}/`),
      axios.get(`http://127.0.0.1:8000/api/categories/?ordering=name`),
    ])
      .then(([itemRes, catsRes]) => {
        setItem(itemRes.data);
        setCategories(catsRes.data);
        setForm({
          name: itemRes.data.name,
          description: itemRes.data.description,
          category_id: itemRes.data.category?.id || "",
          subcategory_id: itemRes.data.subcategory?.id || "",
          price_per_day: itemRes.data.price_per_day,
          deposit_required: itemRes.data.deposit_required,
          minimum_rental_days: itemRes.data.minimum_rental_days,
          maximum_rental_days: itemRes.data.maximum_rental_days,
          location: itemRes.data.location,
          condition: itemRes.data.condition,
          images: [],
        });
        setExistingImages(itemRes.data.images || []);
      })
      .catch(() => setFeedback("Failed to load item"))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch subcategories on category change
  useEffect(() => {
    if (form.category_id) {
      axios
        .get(
          `http://127.0.0.1:8000/api/subcategories/?category=${form.category_id}`
        )
        .then((res) => setSubcategories(res.data))
        .catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
    setForm((prev) => ({ ...prev, subcategory_id: "" }));
  }, [form.category_id]);

  // Handle new image select
  const onImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  // Remove existing image (for backend deletion)
  const removeExistingImage = (imgId) => {
    setRemoveImageIds((ids) => [...ids, imgId]);
    setExistingImages((imgs) => imgs.filter((img) => img.id !== imgId));
  };

  // Remove new image before save
  const removeNewImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const onFieldChange = (e) => {
    let { name, value } = e.target;
    if (name === "minimum_rental_days" || name === "maximum_rental_days")
      value = Number(value);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/items/${id}/`,
        {
          ...form,
          category_id: form.category_id,
          subcategory_id: form.subcategory_id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Remove any deleted images
      for (const imgId of removeImageIds) {
        await axios.delete(`http://127.0.0.1:8000/api/item-images/${imgId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      // Upload any new images
      for (const img of form.images) {
        const imgFormData = new FormData();
        imgFormData.append("item", id);
        imgFormData.append("image_file", img);
        await axios.post(
          "http://127.0.0.1:8000/api/item-images/",
          imgFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setFeedback("Item successfully updated!");
      setTimeout(() => navigate("/my-rentals"), 1400);
    } catch (err) {
      setFeedback("Update failed. Please check your fields.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 size={36} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center font-semibold text-red-500 py-20">
        {feedback}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-stone-50 to-pink-50 min-h-screen py-12 px-3">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-zinc-100">
        <h1 className="text-2xl font-black text-slate-800 mb-7 flex items-center gap-2">
          <Edit className="text-blue-500" size={28} /> Edit Product
        </h1>
        {feedback && (
          <div className="mb-5 px-4 py-2 rounded-xl text-center bg-blue-50 border border-blue-200 text-blue-700 font-medium shadow">
            {feedback}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Category *
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="category_id"
                value={form.category_id}
                onChange={onFieldChange}
                required
              >
                <option value="" disabled>
                  -- Select --
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Subcategory
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="subcategory_id"
                value={form.subcategory_id}
                onChange={onFieldChange}
              >
                <option value="">-- Select --</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Product Name *
              </label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="name"
                value={form.name}
                onChange={onFieldChange}
                required
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Location *
              </label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="location"
                value={form.location}
                onChange={onFieldChange}
                required
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Price per day (₹) *
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="price_per_day"
                value={form.price_per_day}
                onChange={onFieldChange}
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Deposit Amount (₹)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="deposit_required"
                value={form.deposit_required}
                onChange={onFieldChange}
                min={0}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Minimum Rental Days
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="minimum_rental_days"
                value={form.minimum_rental_days}
                onChange={onFieldChange}
                min={1}
                max={form.maximum_rental_days || 90}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Maximum Rental Days
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                name="maximum_rental_days"
                value={form.maximum_rental_days}
                onChange={onFieldChange}
                min={form.minimum_rental_days || 1}
                max={90}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-zinc-700 mb-1">
                Condition
              </label>
              <select
                name="condition"
                className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
                value={form.condition}
                onChange={onFieldChange}
              >
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-bold text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
              name="description"
              rows={3}
              value={form.description}
              onChange={onFieldChange}
              required
            />
          </div>
          {/* Existing Images preview/removal */}
          <div>
            <label className="text-base font-bold text-zinc-700 mb-1 flex items-center gap-2">
              Images <LucideImage size={20} className="text-blue-400" />
            </label>
            <div className="flex gap-3 flex-wrap mb-2">
              {existingImages.map((img, idx) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.image_url}
                    alt={`Product image ${idx + 1}`}
                    className="h-16 w-16 rounded-xl border shadow"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow opacity-80 hover:bg-red-700"
                    onClick={() => removeExistingImage(img.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {/* New image upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={onImageChange}
              className="block w-full border border-zinc-300 rounded-lg py-2 px-4 bg-zinc-100"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((img, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 text-xs bg-stone-100 rounded shadow text-stone-600 relative"
                >
                  {img.name}
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() => removeNewImage(idx)}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-6 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl font-bold shadow bg-zinc-100 text-zinc-700 ml-auto hover:bg-zinc-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
