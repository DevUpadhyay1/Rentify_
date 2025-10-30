// import React from "react";
// import { NavLink } from "react-router-dom";
// import { Home, Box, Star, User, CreditCard, Settings } from "lucide-react";
// import { useAuthContext } from "../../context";

// const Sidebar = ({ className = "" }) => {
//   const { user } = useAuthContext();

//   const nav = [
//     { to: "/", label: "Home", icon: <Home size={16} /> },
//     { to: "/items", label: "Items", icon: <Box size={16} /> },
//     { to: "/favorites", label: "Favorites", icon: <Star size={16} /> },
//   ];

//   const account = [
//     { to: "/profile", label: "Profile", icon: <User size={16} /> },
//     { to: "/my-rentals", label: "My Rentals", icon: <CreditCard size={16} /> },
//     { to: "/settings", label: "Settings", icon: <Settings size={16} /> },
//   ];

//   return (
//     <aside
//       className={`hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 ${className}`}
//     >
//       <div className="h-full container-custom py-6">
//         <nav className="space-y-4">
//           <div>
//             {nav.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-3 py-2 rounded-md ${
//                     isActive
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                   }`
//                 }
//               >
//                 <span className="text-gray-500 dark:text-gray-400">
//                   {item.icon}
//                 </span>
//                 <span className="text-sm font-medium">{item.label}</span>
//               </NavLink>
//             ))}
//           </div>

//           <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
//             <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
//               Account
//             </h4>
//             {account.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-3 py-2 rounded-md ${
//                     isActive
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                   }`
//                 }
//               >
//                 <span className="text-gray-500 dark:text-gray-400">
//                   {item.icon}
//                 </span>
//                 <span className="text-sm font-medium">{item.label}</span>
//               </NavLink>
//             ))}
//           </div>

//           {user && (
//             <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
//               <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
//                 Owner
//               </div>
//               <NavLink
//                 to="/items/add"
//                 className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//               >
//                 <Box size={16} />
//                 <span className="text-sm font-medium">Add Item</span>
//               </NavLink>
//             </div>
//           )}
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
