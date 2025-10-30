// import React from "react";
// import { Loader2 } from "lucide-react";

// const Button = ({
//   children,
//   variant = "primary",
//   size = "md",
//   type = "button",
//   loading = false,
//   disabled = false,
//   icon = null,
//   iconPosition = "left",
//   fullWidth = false,
//   className = "",
//   onClick,
//   ...props
// }) => {
//   // Variant styles
//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
//     success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
//     danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//     warning:
//       "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
//     outline:
//       "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
//     ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
//     link: "text-blue-600 hover:text-blue-800 underline",
//   };

//   // Size styles
//   const sizes = {
//     xs: "px-2 py-1 text-xs",
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-base",
//     lg: "px-6 py-3 text-lg",
//     xl: "px-8 py-4 text-xl",
//   };

//   const baseStyles =
//     "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

//   const widthStyle = fullWidth ? "w-full" : "";

//   const buttonClasses = `
//     ${baseStyles}
//     ${variants[variant]}
//     ${sizes[size]}
//     ${widthStyle}
//     ${className}
//   `.trim();

//   const renderIcon = () => {
//     if (loading) {
//       return <Loader2 className="w-4 h-4 animate-spin" />;
//     }
//     if (icon) {
//       return icon;
//     }
//     return null;
//   };

//   return (
//     <button
//       type={type}
//       className={buttonClasses}
//       disabled={disabled || loading}
//       onClick={onClick}
//       {...props}
//     >
//       {iconPosition === "left" && renderIcon() && (
//         <span className={children ? "mr-2" : ""}>{renderIcon()}</span>
//       )}
//       {children}
//       {iconPosition === "right" && renderIcon() && (
//         <span className={children ? "ml-2" : ""}>{renderIcon()}</span>
//       )}
//     </button>
//   );
// };

// export default Button;

// // ==================== USAGE EXAMPLES ====================
// /*
// // Primary button
// <Button onClick={handleClick}>Click Me</Button>

// // Loading state
// <Button loading={isLoading}>Submit</Button>

// // With icon
// <Button icon={<Plus />}>Add Item</Button>

// // Different variants
// <Button variant="success">Save</Button>
// <Button variant="danger">Delete</Button>
// <Button variant="outline">Cancel</Button>

// // Different sizes
// <Button size="sm">Small</Button>
// <Button size="lg">Large</Button>

// // Full width
// <Button fullWidth>Full Width Button</Button>
// */
