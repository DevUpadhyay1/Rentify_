// import React, { useState } from "react";
// import { CreditCard, Building, Wallet, Check, AlertCircle } from "lucide-react";
// import {
//   Card,
//   Button,
//   Input,
//   Select,
//   Alert,
//   Badge,
// } from "../../components/common";
// import { useNavigate, useLocation } from "react-router-dom";
// import { formatCurrency } from "../../utils";

// const BillingPayment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const orderData = location.state?.orderData;

//   const [paymentMethod, setPaymentMethod] = useState("card"); // card, upi, netbanking
//   const [processing, setProcessing] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [cardData, setCardData] = useState({
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: "",
//   });

//   const [upiData, setUpiData] = useState({
//     upiId: "",
//   });

//   const [netbankingData, setNetbankingData] = useState({
//     bank: "",
//   });

//   const paymentMethods = [
//     { id: "card", name: "Credit/Debit Card", icon: <CreditCard size={20} /> },
//     { id: "upi", name: "UPI", icon: <Wallet size={20} /> },
//     { id: "netbanking", name: "Net Banking", icon: <Building size={20} /> },
//   ];

//   const banks = [
//     { value: "hdfc", label: "HDFC Bank" },
//     { value: "icici", label: "ICICI Bank" },
//     { value: "sbi", label: "State Bank of India" },
//     { value: "axis", label: "Axis Bank" },
//     { value: "kotak", label: "Kotak Mahindra Bank" },
//   ];

//   const handleCardChange = (e) => {
//     const { name, value } = e.target;
//     setCardData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validatePayment = () => {
//     const newErrors = {};

//     if (paymentMethod === "card") {
//       if (!cardData.cardNumber || cardData.cardNumber.length < 16) {
//         newErrors.cardNumber = "Invalid card number";
//       }
//       if (!cardData.cardName)
//         newErrors.cardName = "Card holder name is required";
//       if (!cardData.expiryDate)
//         newErrors.expiryDate = "Expiry date is required";
//       if (!cardData.cvv || cardData.cvv.length < 3)
//         newErrors.cvv = "Invalid CVV";
//     } else if (paymentMethod === "upi") {
//       if (!upiData.upiId) newErrors.upiId = "UPI ID is required";
//     } else if (paymentMethod === "netbanking") {
//       if (!netbankingData.bank) newErrors.bank = "Please select a bank";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     if (!validatePayment()) return;

//     setProcessing(true);

//     // Simulate payment processing
//     setTimeout(() => {
//       setProcessing(false);
//       navigate("/payment-success", {
//         state: {
//           orderId: orderData?.id,
//           amount: orderData?.total_price,
//         },
//       });
//     }, 2000);
//   };

//   if (!orderData) {
//     return (
//       <div className="container-custom py-12">
//         <Alert
//           type="error"
//           title="No order data"
//           message="Please select an item to rent first"
//         />
//         <Button onClick={() => navigate("/items")} className="mt-4">
//           Browse Items
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container-custom max-w-6xl py-6">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
//         Payment & Billing
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Payment Form */}
//         <div className="lg:col-span-2">
//           {/* Payment Method Selection */}
//           <Card className="mb-6" padding="lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Select Payment Method
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {paymentMethods.map((method) => (
//                 <button
//                   key={method.id}
//                   onClick={() => setPaymentMethod(method.id)}
//                   className={`p-4 rounded-lg border-2 transition-all ${
//                     paymentMethod === method.id
//                       ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
//                       : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   <div className="flex flex-col items-center gap-2">
//                     <div
//                       className={
//                         paymentMethod === method.id
//                           ? "text-blue-600"
//                           : "text-gray-600"
//                       }
//                     >
//                       {method.icon}
//                     </div>
//                     <span className="text-sm font-medium text-gray-900 dark:text-white">
//                       {method.name}
//                     </span>
//                     {paymentMethod === method.id && (
//                       <Check size={16} className="text-blue-600" />
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </Card>

//           {/* Payment Details Form */}
//           <Card padding="lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Payment Details
//             </h2>

//             <form onSubmit={handlePayment} className="space-y-4">
//               {/* Card Payment */}
//               {paymentMethod === "card" && (
//                 <>
//                   <Input
//                     label="Card Number"
//                     name="cardNumber"
//                     value={cardData.cardNumber}
//                     onChange={handleCardChange}
//                     placeholder="1234 5678 9012 3456"
//                     maxLength={16}
//                     error={errors.cardNumber}
//                     required
//                     fullWidth
//                   />

//                   <Input
//                     label="Card Holder Name"
//                     name="cardName"
//                     value={cardData.cardName}
//                     onChange={handleCardChange}
//                     placeholder="John Doe"
//                     error={errors.cardName}
//                     required
//                     fullWidth
//                   />

//                   <div className="grid grid-cols-2 gap-4">
//                     <Input
//                       label="Expiry Date"
//                       name="expiryDate"
//                       value={cardData.expiryDate}
//                       onChange={handleCardChange}
//                       placeholder="MM/YY"
//                       maxLength={5}
//                       error={errors.expiryDate}
//                       required
//                       fullWidth
//                     />

//                     <Input
//                       label="CVV"
//                       name="cvv"
//                       type="password"
//                       value={cardData.cvv}
//                       onChange={handleCardChange}
//                       placeholder="123"
//                       maxLength={3}
//                       error={errors.cvv}
//                       required
//                       fullWidth
//                     />
//                   </div>
//                 </>
//               )}

//               {/* UPI Payment */}
//               {paymentMethod === "upi" && (
//                 <Input
//                   label="UPI ID"
//                   name="upiId"
//                   value={upiData.upiId}
//                   onChange={(e) => setUpiData({ upiId: e.target.value })}
//                   placeholder="yourname@upi"
//                   error={errors.upiId}
//                   required
//                   fullWidth
//                 />
//               )}

//               {/* Net Banking */}
//               {paymentMethod === "netbanking" && (
//                 <Select
//                   label="Select Bank"
//                   value={netbankingData.bank}
//                   onChange={(e) => setNetbankingData({ bank: e.target.value })}
//                   options={banks}
//                   error={errors.bank}
//                   required
//                   fullWidth
//                 />
//               )}

//               {/* Security Notice */}
//               <Alert
//                 type="info"
//                 icon={<AlertCircle size={16} />}
//                 message="Your payment information is encrypted and secure"
//               />

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 fullWidth
//                 size="lg"
//                 loading={processing}
//                 disabled={processing}
//               >
//                 {processing
//                   ? "Processing..."
//                   : `Pay ${formatCurrency(orderData.total_price)}`}
//               </Button>
//             </form>
//           </Card>
//         </div>

//         {/* Order Summary */}
//         <div>
//           <Card padding="lg" className="sticky top-6">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Order Summary
//             </h2>

//             {/* Item Details */}
//             <div className="mb-4">
//               <img
//                 src={
//                   orderData.item?.images?.[0]?.image || "/placeholder-item.jpg"
//                 }
//                 alt={orderData.item?.name}
//                 className="w-full h-40 object-cover rounded-lg mb-3"
//               />
//               <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
//                 {orderData.item?.name}
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {orderData.item?.category_display}
//               </p>
//             </div>

//             {/* Pricing Details */}
//             <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Price per day
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   {formatCurrency(orderData.item?.price_per_day)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Duration
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   {orderData.duration} days
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Subtotal
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   {formatCurrency(orderData.subtotal)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Service Fee (10%)
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   {formatCurrency(orderData.service_fee)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600 dark:text-gray-400">
//                   Security Deposit
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   {formatCurrency(orderData.security_deposit || 0)}
//                 </span>
//               </div>
//             </div>

//             {/* Total */}
//             <div className="flex justify-between items-center border-t-2 border-gray-200 dark:border-gray-700 pt-4 mt-4">
//               <span className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Total Amount
//               </span>
//               <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//                 {formatCurrency(orderData.total_price)}
//               </span>
//             </div>

//             {/* Refundable Deposit Notice */}
//             {orderData.security_deposit > 0 && (
//               <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                 <p className="text-xs text-yellow-800 dark:text-yellow-200">
//                   * Security deposit of{" "}
//                   {formatCurrency(orderData.security_deposit)} will be refunded
//                   after return
//                 </p>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingPayment;
