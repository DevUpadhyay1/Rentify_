// import React from "react";
// import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

// const Alert = ({
//   type = "info",
//   title,
//   message,
//   onClose,
//   dismissible = false,
//   className = "",
// }) => {
//   const types = {
//     success: {
//       bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
//       text: "text-green-800 dark:text-green-200",
//       icon: <CheckCircle className="w-5 h-5" />,
//     },
//     error: {
//       bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
//       text: "text-red-800 dark:text-red-200",
//       icon: <AlertCircle className="w-5 h-5" />,
//     },
//     warning: {
//       bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
//       text: "text-yellow-800 dark:text-yellow-200",
//       icon: <AlertTriangle className="w-5 h-5" />,
//     },
//     info: {
//       bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
//       text: "text-blue-800 dark:text-blue-200",
//       icon: <Info className="w-5 h-5" />,
//     },
//   };

//   const config = types[type];

//   return (
//     <div
//       className={`
//         flex items-start gap-3 p-4 rounded-lg border
//         ${config.bg} ${config.text}
//         ${className}
//       `}
//       role="alert"
//     >
//       <div className="flex-shrink-0 mt-0.5">{config.icon}</div>

//       <div className="flex-1 min-w-0">
//         {title && <h4 className="font-semibold mb-1">{title}</h4>}
//         {message && <p className="text-sm">{message}</p>}
//       </div>

//       {dismissible && onClose && (
//         <button
//           onClick={onClose}
//           className="flex-shrink-0 hover:opacity-70 transition-opacity"
//           aria-label="Close alert"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Alert;

// // ==================== USAGE ====================
// /*
// // Success alert
// <Alert
//   type="success"
//   title="Success!"
//   message="Item added successfully"
// />

// // Error with dismiss
// <Alert
//   type="error"
//   title="Error"
//   message="Failed to upload image"
//   dismissible
//   onClose={() => console.log('closed')}
// />

// // Warning
// <Alert
//   type="warning"
//   message="Your session will expire in 5 minutes"
// />

// // Info
// <Alert
//   type="info"
//   title="Tip"
//   message="Use filters to narrow down results"
// />
// */
