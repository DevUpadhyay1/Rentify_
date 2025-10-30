// import React, { forwardRef } from "react";

// const Input = forwardRef(
//   (
//     {
//       type = "text",
//       label,
//       error,
//       helperText,
//       icon,
//       iconPosition = "left",
//       fullWidth = false,
//       size = "md",
//       disabled = false,
//       required = false,
//       className = "",
//       containerClassName = "",
//       ...props
//     },
//     ref
//   ) => {
//     // Size styles
//     const sizes = {
//       sm: "px-3 py-1.5 text-sm",
//       md: "px-4 py-2 text-base",
//       lg: "px-5 py-3 text-lg",
//     };

//     const baseInputStyles = `
//     w-full rounded-lg border transition-all duration-200
//     focus:outline-none focus:ring-2 focus:ring-offset-1
//     disabled:bg-gray-100 disabled:cursor-not-allowed
//     dark:bg-gray-800 dark:text-white
//   `;

//     const normalStyles =
//       "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600";
//     const errorStyles =
//       "border-red-500 focus:border-red-500 focus:ring-red-500";

//     const inputClasses = `
//     ${baseInputStyles}
//     ${error ? errorStyles : normalStyles}
//     ${sizes[size]}
//     ${icon && iconPosition === "left" ? "pl-10" : ""}
//     ${icon && iconPosition === "right" ? "pr-10" : ""}
//     ${className}
//   `.trim();

//     return (
//       <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
//         {label && (
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             {label}
//             {required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         <div className="relative">
//           {icon && iconPosition === "left" && (
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//               {icon}
//             </div>
//           )}

//           <input
//             ref={ref}
//             type={type}
//             className={inputClasses}
//             disabled={disabled}
//             required={required}
//             {...props}
//           />

//           {icon && iconPosition === "right" && (
//             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//               {icon}
//             </div>
//           )}
//         </div>

//         {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

//         {helperText && !error && (
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             {helperText}
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = "Input";

// export default Input;

// // ==================== USAGE EXAMPLES ====================
// /*
// import { Mail, Lock } from 'lucide-react';

// // Basic input
// <Input
//   label="Email"
//   type="email"
//   placeholder="Enter your email"
// />

// // With icon
// <Input
//   label="Email"
//   icon={<Mail size={18} />}
//   placeholder="Enter your email"
// />

// // With error
// <Input
//   label="Password"
//   type="password"
//   error="Password is required"
// />

// // With helper text
// <Input
//   label="Username"
//   helperText="Choose a unique username"
// />

// // Required field
// <Input
//   label="Full Name"
//   required
// />

// // Disabled
// <Input
//   label="Email"
//   value="user@example.com"
//   disabled
// />
// */
