// import React, { forwardRef } from "react";

// const Textarea = forwardRef(
//   (
//     {
//       label,
//       error,
//       helperText,
//       maxLength,
//       showCount = false,
//       rows = 4,
//       required = false,
//       disabled = false,
//       fullWidth = false,
//       resize = "vertical",
//       className = "",
//       value,
//       ...props
//     },
//     ref
//   ) => {
//     const baseStyles = `
//     w-full rounded-lg border px-4 py-2
//     bg-white dark:bg-gray-800 dark:text-white
//     transition-all duration-200
//     focus:outline-none focus:ring-2 focus:ring-offset-1
//     disabled:bg-gray-100 disabled:cursor-not-allowed
//   `;

//     const normalStyles =
//       "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600";
//     const errorStyles =
//       "border-red-500 focus:border-red-500 focus:ring-red-500";

//     const resizeClasses = {
//       none: "resize-none",
//       vertical: "resize-y",
//       horizontal: "resize-x",
//       both: "resize",
//     };

//     const currentLength = value?.length || 0;

//     return (
//       <div className={fullWidth ? "w-full" : ""}>
//         {label && (
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {label}
//             {required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         <textarea
//           ref={ref}
//           rows={rows}
//           maxLength={maxLength}
//           value={value}
//           disabled={disabled}
//           required={required}
//           className={`
//           ${baseStyles}
//           ${error ? errorStyles : normalStyles}
//           ${resizeClasses[resize]}
//           ${className}
//         `}
//           {...props}
//         />

//         <div className="flex items-center justify-between mt-1">
//           <div className="flex-1">
//             {error && <p className="text-sm text-red-500">{error}</p>}
//             {helperText && !error && (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {helperText}
//               </p>
//             )}
//           </div>

//           {showCount && maxLength && (
//             <p
//               className={`text-sm ml-2 ${
//                 currentLength > maxLength * 0.9
//                   ? "text-red-500"
//                   : "text-gray-500"
//               }`}
//             >
//               {currentLength}/{maxLength}
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }
// );

// Textarea.displayName = "Textarea";

// export default Textarea;

// // ==================== USAGE ====================
// /*
// // Basic
// <Textarea
//   label="Description"
//   placeholder="Enter item description"
//   rows={5}
// />

// // With character count
// <Textarea
//   label="Review"
//   maxLength={500}
//   showCount
//   value={review}
//   onChange={(e) => setReview(e.target.value)}
// />

// // With error
// <Textarea
//   label="Message"
//   error="Message is required"
//   required
// />

// // No resize
// <Textarea
//   label="Notes"
//   resize="none"
//   rows={3}
// />
// */
