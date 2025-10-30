// src/components/auth/ForgotPassword.jsx
import React, { useState } from "react";
import {
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/auth/forgot-password/", {
        email,
      });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.email ||
          err.response?.data?.detail ||
          "Couldn't send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
        <Mail className="mx-auto text-blue-600 w-12 h-12 mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 mb-2">
          Enter your registered email and we'll send you a reset link.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
          />
          {error && (
            <p className="flex items-center gap-1 text-red-600 text-sm text-left">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || sent}
            className="w-full flex items-center justify-center gap-1 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : sent ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              "Send Reset Link"
            )}
            <span>{sent ? "Reset link sent!" : ""}</span>
          </button>
        </form>
        {sent && (
          <p className="text-green-700 text-sm mt-2">
            Check your inbox for the reset link.
          </p>
        )}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
