// src/components/auth/EmailVerifiedSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

const EmailVerifiedSuccess = () => {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Call your backend verify-email endpoint with uidb64/token
    const verifyEmail = async () => {
      try {
        await axios.get(
          `http://127.0.0.1:8000/auth/verify-email/${uidb64}/${token}/`
        ); // Adjust to your backend URL as needed
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(
          err.response?.data?.detail || "Invalid or expired verification link."
        );
      }
    };
    verifyEmail();
  }, [uidb64, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-8">
        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
            <p className="text-blue-700 text-lg">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-14 h-14 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-green-800">
              Email Verified!
            </h2>
            <p className="text-gray-700 mb-6">
              Your email address has been verified.
              <br />
              You can now sign in to your Rentify account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-14 h-14 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-red-800">
              Verification Error
            </h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerifiedSuccess;
