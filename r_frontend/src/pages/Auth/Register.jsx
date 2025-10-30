import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Button, Input, Alert, Card } from "../../components/common";
import { useAuthContext } from "../../context";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
} from "../../utils";

const Register = () => {
  const { register, loading } = useAuthContext();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear API error
    if (apiError) setApiError("");
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // First name
    const firstNameError = validateName(formData.first_name, "First name");
    if (firstNameError) newErrors.first_name = firstNameError;

    // Last name
    const lastNameError = validateName(formData.last_name, "Last name");
    if (lastNameError) newErrors.last_name = lastNameError;

    // Email
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Phone
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Password
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    // Remove confirmPassword before sending
    const { confirmPassword, ...userData } = formData;

    const result = await register(userData);

    if (!result.success) {
      const errorMsg =
        result.error?.response?.data?.message ||
        result.error?.response?.data?.email?.[0] ||
        "Registration failed. Please try again.";
      setApiError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl" padding="lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4">
            <span className="text-3xl font-bold">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join Rentify and start renting today
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <Alert
            type="error"
            message={apiError}
            dismissible
            onClose={() => setApiError("")}
            className="mb-6"
          />
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
              icon={<User size={18} />}
              error={errors.first_name}
              required
              fullWidth
            />

            <Input
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              icon={<User size={18} />}
              error={errors.last_name}
              required
              fullWidth
            />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            icon={<Mail size={18} />}
            error={errors.email}
            required
            fullWidth
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            icon={<Phone size={18} />}
            error={errors.phone}
            helperText="10-digit mobile number"
            required
            fullWidth
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              icon={<Lock size={18} />}
              error={errors.password}
              helperText="At least 8 characters with uppercase, lowercase, and numbers"
              required
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              icon={<Lock size={18} />}
              error={errors.confirmPassword}
              required
              fullWidth
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <Link to="/login">
            <Button variant="outline" fullWidth>
              Sign In
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
