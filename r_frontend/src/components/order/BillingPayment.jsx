import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  LoaderCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Tag,
  ArrowRight,
  Download,
  Receipt,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BillingPayment = ({ billId }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view this page.");
      return navigate("/login");
    }

    async function fetchUser() {
      try {
        const { data } = await axios.get("api/auth/me", {
          headers: getAuthHeaders(),
        });
        setCurrentUser(data);
      } catch (e) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } finally {
        setCheckedAuth(true);
      }
    }
    fetchUser();
  }, [navigate]);

  // Fetch bill details
  useEffect(() => {
    if (!currentUser || !checkedAuth) return;

    const fetchBillDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/billing/bills/${billId}/`, {
          headers: getAuthHeaders(),
        });
        setBill(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bill details");
        setLoading(false);
        toast.error("Failed to load bill details");
      }
    };

    fetchBillDetails();
  }, [billId, currentUser, checkedAuth]);

  const initiatePayment = async (paymentMethod) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/billing/bills/${billId}/initiate_payment/`,
        { payment_method: paymentMethod },
        { headers: getAuthHeaders() }
      );

      if (paymentMethod === "cod") {
        toast.success(
          "✅ Cash on Delivery selected! Pay when you receive the item."
        );
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } else if (paymentMethod === "razorpay") {
        openRazorpayCheckout(response.data.payment_data);
      }

      setProcessing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Payment initiation failed");
      setProcessing(false);
      toast.error(err.response?.data?.detail || "Payment initiation failed");
    }
  };

  const openRazorpayCheckout = (paymentData) => {
    console.log("🎯 Opening Razorpay with data:", paymentData); // Debug log

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      console.error("❌ Razorpay script not loaded!");
      toast.error("Payment gateway not loaded. Please refresh the page.");
      setProcessing(false);
      return;
    }

    const options = {
      key: paymentData.razorpay_key_id,
      amount: paymentData.amount * 100,
      currency: "INR",
      name: "Rentify",
      description: `Payment for Bill #${paymentData.bill.bill_number}`,
      order_id: paymentData.razorpay_order_id,
      handler: async (response) => {
        console.log("✅ Payment successful:", response);
        await verifyPayment(response);
      },
      prefill: {
        name: paymentData.customer?.name || "",
        email: paymentData.customer?.email || "",
        contact: paymentData.customer?.contact || "",
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: () => {
          console.log("⚠ Payment modal dismissed");
          setProcessing(false);
          toast.warning("Payment cancelled");
        },
      },
    };

    console.log("🔧 Razorpay options:", options);

    try {
      const rzp = new window.Razorpay(options);
      console.log("✅ Razorpay instance created");
      rzp.open();
      console.log("✅ Razorpay modal opened");
    } catch (error) {
      console.error("❌ Error opening Razorpay:", error);
      toast.error("Failed to open payment gateway: " + error.message);
      setProcessing(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    setProcessing(true);

    try {
      const response = await axios.post(
        `/api/billing/bills/${billId}/verify_payment/`,
        {
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        toast.success("✅ Payment successful! Redirecting...", {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/orders");
        }, 2500);
      }

      setProcessing(false);
    } catch (err) {
      setError("Payment verification failed!");
      setProcessing(false);
      toast.error("Payment verification failed!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "failed":
        return <XCircle className="w-5 h-5" />;
      case "refunded":
        return <ArrowRight className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <LoaderCircle className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md border-2 border-red-200">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Bill Not Found
          </h3>
          <p className="text-gray-600">
            The requested bill could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Receipt className="w-10 h-10" />
                <div>
                  <h1 className="text-3xl font-bold">
                    Invoice #{bill.bill_number}
                  </h1>
                  <p className="text-indigo-100 text-sm mt-1">
                    Booking ID: #{bill.booking_id}
                  </p>
                </div>
              </div>
              <span
                className={`px-5 py-2 backdrop-blur-sm rounded-full text-sm font-bold border-2 ${getStatusColor(
                  bill.payment_status
                )} flex items-center gap-2`}
              >
                {getStatusIcon(bill.payment_status)}
                {bill.payment_status_display}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Bill Details Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Bill Details
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-600">Invoice Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(bill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-600">User</p>
                    <p className="font-semibold text-gray-900">
                      {bill.user.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Amount Breakdown
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{parseFloat(bill.subtotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">
                      ₹{parseFloat(bill.tax).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Service Fee</span>
                    <span className="font-semibold">
                      ₹{parseFloat(bill.service_fee).toFixed(2)}
                    </span>
                  </div>

                  {bill.discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -₹{parseFloat(bill.discount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold text-indigo-700">
                        ₹{parseFloat(bill.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {bill.payment_status === "paid" ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 text-center">
                <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                  Payment Completed!
                </h3>
                <p className="text-green-700 mb-4">
                  Paid on {new Date(bill.paid_at).toLocaleDateString()} at{" "}
                  {new Date(bill.paid_at).toLocaleTimeString()}
                </p>
                {bill.payment_method_display && (
                  <div className="flex items-center justify-center gap-2 text-green-800">
                    <Wallet className="w-5 h-5" />
                    <span className="font-semibold">
                      Method: {bill.payment_method_display}
                    </span>
                  </div>
                )}
                {bill.razorpay_payment_id && (
                  <p className="text-sm text-green-600 mt-3">
                    Transaction ID: {bill.razorpay_payment_id}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <CreditCard className="w-7 h-7 text-indigo-600" />
                  Select Payment Method
                </h3>

                {error && (
                  <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">
                        Payment Error
                      </h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {/* Razorpay Option */}
                  <div
                    onClick={() => setSelectedMethod("razorpay")}
                    className={`cursor-pointer rounded-2xl p-6 border-3 transition-all duration-300 ${
                      selectedMethod === "razorpay"
                        ? "border-indigo-600 bg-indigo-50 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-indigo-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          selectedMethod === "razorpay"
                            ? "bg-indigo-600"
                            : "bg-gradient-to-br from-indigo-100 to-purple-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-8 h-8 ${
                            selectedMethod === "razorpay"
                              ? "text-white"
                              : "text-indigo-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          Pay with Razorpay
                        </h4>
                        <p className="text-sm text-gray-600">
                          Credit Card, Debit Card, UPI, Net Banking, Wallets
                        </p>
                      </div>
                      {selectedMethod === "razorpay" && (
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    onClick={() => setSelectedMethod("cod")}
                    className={`cursor-pointer rounded-2xl p-6 border-3 transition-all duration-300 ${
                      selectedMethod === "cod"
                        ? "border-amber-600 bg-amber-50 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          selectedMethod === "cod"
                            ? "bg-amber-600"
                            : "bg-gradient-to-br from-amber-100 to-orange-100"
                        }`}
                      >
                        <Banknote
                          className={`w-8 h-8 ${
                            selectedMethod === "cod"
                              ? "text-white"
                              : "text-amber-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          Cash on Delivery (COD)
                        </h4>
                        <p className="text-sm text-gray-600">
                          Pay when you receive the item
                        </p>
                      </div>
                      {selectedMethod === "cod" && (
                        <CheckCircle className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={() => initiatePayment(selectedMethod)}
                  disabled={!selectedMethod || processing}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl"
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="animate-spin w-6 h-6" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      {selectedMethod === "razorpay" ? (
                        <>
                          <CreditCard className="w-6 h-6" />
                          Pay ₹{parseFloat(bill.total_amount).toFixed(2)}
                        </>
                      ) : selectedMethod === "cod" ? (
                        <>
                          <Banknote className="w-6 h-6" />
                          Confirm Cash on Delivery
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6" />
                          Select a Payment Method
                        </>
                      )}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            )}

            {/* Transaction History */}
            {bill.transactions && bill.transactions.length > 0 && (
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  Transaction History
                </h3>
                <div className="space-y-3">
                  {bill.transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <p className="font-bold text-gray-900">
                            {txn.transaction_id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {txn.payment_method_display}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              txn.status
                            )}`}
                          >
                            {txn.status_display}
                          </span>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            ₹{parseFloat(txn.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(txn.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPayment;
