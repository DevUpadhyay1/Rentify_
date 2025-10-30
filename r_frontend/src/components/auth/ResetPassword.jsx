// src/components/auth/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/auth/reset-password/", {
        uidb64,
        token,
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.new_password ||
          "Failed to reset password. Try again or request another link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
        <Lock className="mx-auto text-blue-600 w-12 h-12 mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="text-gray-600">Enter a new password for your account.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoFocus
              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={success}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              disabled={success}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {error && (
            <p className="flex items-center gap-1 text-red-600 text-sm text-left">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || success || newPassword.length < 6}
            className="w-full flex items-center justify-center gap-1 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>
              {success ? "Password reset! Redirecting..." : "Change Password"}
            </span>
          </button>
        </form>
        {success && (
          <p className="text-green-700 text-sm mt-2">
            Your password was reset. You will now be redirected to login.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
