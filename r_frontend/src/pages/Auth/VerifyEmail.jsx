import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button, Card } from "../../components/common";
import { useAuthContext } from "../../context";

const VerifyEmail = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthContext();

  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (uidb64 && token) {
        const result = await verifyEmail(uidb64, token);

        if (result.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            result.error?.response?.data?.message ||
              "Verification failed. The link may be invalid or expired."
          );
        }
      } else {
        setStatus("error");
        setMessage("Invalid verification link.");
      }
    };

    verify();
  }, [uidb64, token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" padding="lg">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-6">
          <span className="text-3xl font-bold">R</span>
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifying Email...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login page...
            </p>
            <Link to="/login">
              <Button fullWidth>Go to Login</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/login">
                <Button fullWidth>Go to Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" fullWidth>
                  Create New Account
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmail;
