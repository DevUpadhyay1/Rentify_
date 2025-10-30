import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Edit2, Camera } from "lucide-react";
import {
  Button,
  Input,
  Card,
  Avatar,
  Alert,
  Modal,
} from "../../components/common";
import { useAuthContext } from "../../context";
import { formatDate } from "../../utils";

const Profile = () => {
  const { user, updateProfile, loading } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name?.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name?.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess(false);

    if (!validate()) return;

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setApiError(
        result.error?.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });
    setIsEditing(false);
    setErrors({});
    setApiError("");
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const result = await updateProfile(formData);
    if (result.success) {
      setAvatarModalOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-12">
        <Alert type="error" message="Please login to view your profile" />
      </div>
    );
  }

  return (
    <div className="container-custom max-w-4xl py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        My Profile
      </h1>

      {success && (
        <Alert
          type="success"
          message="Profile updated successfully!"
          dismissible
          onClose={() => setSuccess(false)}
          className="mb-6"
        />
      )}

      {apiError && (
        <Alert
          type="error"
          message={apiError}
          dismissible
          onClose={() => setApiError("")}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1" padding="lg">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar
                src={user.avatar}
                name={`${user.first_name} ${user.last_name}`}
                size="2xl"
              />
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {user.email}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone size={16} />
                <span>{user.phone || "Not provided"}</span>
              </div>

              {user.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>Joined {formatDate(user.date_joined)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h3>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={<Edit2 size={16} />}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  required
                  fullWidth
                />

                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  required
                  fullWidth
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={user.email}
                disabled
                helperText="Email cannot be changed"
                fullWidth
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                fullWidth
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                fullWidth
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    First Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.first_name}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.last_name}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Phone
                </label>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {user.location && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Location
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Avatar Upload Modal */}
      <Modal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Change Profile Picture"
      >
        <div className="space-y-4">
          <div className="text-center">
            <Avatar
              src={user.avatar}
              name={`${user.first_name} ${user.last_name}`}
              size="2xl"
              className="mx-auto mb-4"
            />
          </div>

          <label className="block">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Click to upload new photo
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
