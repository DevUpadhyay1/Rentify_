// import React, { useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Menu, Sun, Moon, LogOut, User, Search } from "lucide-react";
// import { Button, Input, Avatar } from "../common";
// import { useTheme, useAuthContext } from "../../context";

// const Header = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { theme, toggleTheme, isDarkMode } = useTheme();
//   const { user, logout } = useAuthContext();
//   const navigate = useNavigate();

//   return (
//     <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
//       <div className="container-custom flex items-center gap-4 py-3">
//         <div className="flex items-center gap-3">
//           <button
//             className="p-2 rounded-md md:hidden text-gray-700 dark:text-gray-200"
//             onClick={() => setMobileOpen(!mobileOpen)}
//             aria-label="Toggle menu"
//           >
//             <Menu size={20} />
//           </button>

//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-[var(--color-primary-500)] text-white rounded-md flex items-center justify-center font-bold">
//               R
//             </div>
//             <span className="hidden sm:inline font-semibold text-gray-900 dark:text-white">
//               Rentify
//             </span>
//           </Link>
//         </div>

//         <div className="hidden md:flex flex-1 items-center justify-center">
//           <div className="w-full max-w-2xl">
//             <Input
//               placeholder="Search items, categories, locations..."
//               icon={<Search size={16} />}
//               iconPosition="left"
//               fullWidth
//               size="md"
//             />
//           </div>
//         </div>

//         <nav className="ml-auto flex items-center gap-3">
//           <div className="hidden md:flex items-center gap-2">
//             <NavLink
//               to="/items"
//               className={({ isActive }) =>
//                 isActive
//                   ? "text-blue-600 font-medium"
//                   : "text-gray-600 dark:text-gray-300"
//               }
//             >
//               Browse
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 isActive
//                   ? "text-blue-600 font-medium"
//                   : "text-gray-600 dark:text-gray-300"
//               }
//             >
//               About
//             </NavLink>
//           </div>

//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//             aria-label="Toggle theme"
//           >
//             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//           </button>

//           {user ? (
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => navigate("/profile")}
//                 className="hidden md:inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
//               >
//                 <Avatar
//                   src={user.avatar || null}
//                   name={`${user.first_name} ${user.last_name}`}
//                   size="sm"
//                 />
//                 <span>{user.first_name}</span>
//               </button>

//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={logout}
//                 className="hidden md:inline-flex"
//               >
//                 <LogOut size={16} className="mr-2" /> Logout
//               </Button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </Button>
//               <Button size="sm" onClick={() => navigate("/register")}>
//                 Sign up
//               </Button>
//             </div>
//           )}
//         </nav>
//       </div>

//       {/* Mobile nav */}
//       {mobileOpen && (
//         <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
//           <div className="p-3 space-y-2">
//             <NavLink
//               to="/items"
//               className="block text-gray-700 dark:text-gray-200"
//             >
//               Browse
//             </NavLink>
//             <NavLink
//               to="/about"
//               className="block text-gray-700 dark:text-gray-200"
//             >
//               About
//             </NavLink>
//             <div className="flex items-center gap-2 pt-2">
//               <button
//                 onClick={toggleTheme}
//                 className="p-2 rounded-md text-gray-600 dark:text-gray-300"
//               >
//                 {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} Toggle
//                 Theme
//               </button>
//             </div>
//             <div>
//               {user ? (
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       src={user.avatar || null}
//                       name={`${user.first_name} ${user.last_name}`}
//                       size="sm"
//                     />
//                     <div>
//                       <div className="font-medium text-gray-900 dark:text-white">
//                         {user.first_name} {user.last_name}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         {user.email}
//                       </div>
//                     </div>
//                   </div>
//                   <Button size="sm" variant="outline" onClick={logout}>
//                     <LogOut size={14} />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => navigate("/login")}
//                   >
//                     Login
//                   </Button>
//                   <Button size="sm" onClick={() => navigate("/register")}>
//                     Sign up
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
