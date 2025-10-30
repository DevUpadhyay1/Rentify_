  // src/components/auth/EmailVerification.jsx
  import React, { useState } from "react";
  import {
    Mail,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Repeat,
  } from "lucide-react";
  import { useLocation } from "react-router-dom";
  import { authApi } from "../../api/api";

  const EmailVerification = () => {
    // If you pass email in location.state from registration, you can prefill here:
    const location = useLocation();
    const prefilledEmail = location.state?.email || "";

    const [email, setEmail] = useState(prefilledEmail);
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);
    const [error, setError] = useState("");

    // Resend Verification Email Handler
    const handleResend = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        // Use your resend endpoint here (from your api.js setup!)
        await authApi.resendVerification(email);
        setResent(true);
      } catch (err) {
        setError(
          err.response?.data?.email || "Could not resend verification email."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
          <Mail className="mx-auto text-blue-600 w-12 h-12 mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to your email.
            <br />
            Please click the link to activate your account.
          </p>
          <form onSubmit={handleResend} className="space-y-4">
            <input
              type="email"
              disabled={!!prefilledEmail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
            />
            {resent && (
              <p className="flex items-center justify-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" /> Resent! Check your inbox.
              </p>
            )}
            {error && (
              <p className="flex items-center justify-center gap-1 text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4" /> {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              Resend Verification Email
            </button>
          </form>
          <hr className="my-4 border-blue-100" />
          <div className="text-sm text-blue-700">
            Didn&apos;t get the email? Check your spam folder or resend your link
            above.
          </div>
        </div>
      </div>
    );
  };

  export default EmailVerification;
