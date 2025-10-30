// import React, { forwardRef } from 'react';
// import { ChevronDown } from 'lucide-react';

// const Select = forwardRef(({
//   label,
//   options = [],
//   error,
//   helperText,
//   placeholder = 'Select an option',
//   required = false,
//   disabled = false,
//   fullWidth = false,
//   size = 'md',
//   className = '',
//   ...props
// }, ref) => {
//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-base',
//     lg: 'px-5 py-3 text-lg',
//   };

//   const baseStyles = `
//     w-full rounded-lg border appearance-none cursor-pointer
//     bg-white dark:bg-gray-800 dark:text-white
//     transition-all duration-200
//     focus:outline-none focus:ring-2 focus:ring-offset-1
//     disabled:bg-gray-100 disabled:cursor-not-allowed
//   `;

//   const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600';
//   const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';

//   return (
//     <div className={fullWidth ? 'w-full' : ''}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}

//       <div className="relative">
//         <select
//           ref={ref}
//           className={`
//             ${baseStyles}
//             ${error ? errorStyles : normalStyles}
//             ${sizes[size]}
//             ${className}
//             pr-10
//           `}
//           disabled={disabled}
//           required={required}
//           {...props}
//         >
//           <option value="" disabled>
//             {placeholder}
//           </option>
//           {options.map((option) => (
//             <option
//               key={option.value}
//               value={option.value}
//               disabled={option.disabled}
//             >
//               {option.icon && `${option.icon} `}
//               {option.label}
//             </option>
//           ))}
//         </select>

//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//           <ChevronDown size={18} />
//         </div>
//       </div>

//       {error && (
//         <p className="mt-1 text-sm text-red-500">{error}</p>
//       )}

//       {helperText && !error && (
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
//       )}
//     </div>
//   );
// });

// Select.displayName = 'Select';

// export default Select;

// // ==================== USAGE ====================
// /*
// import { CATEGORIES } from '../utils/constants';

// <Select
//   label="Category"
//   options={CATEGORIES}
//   placeholder="Choose a category"
//   required
// />

// // With error
// <Select
//   label="Category"
//   options={CATEGORIES}
//   error="Category is required"
// />

// // Disabled
// <Select
//   label="Status"
//   options={STATUS_OPTIONS}
//   disabled
//   value="pending"
// />
// */