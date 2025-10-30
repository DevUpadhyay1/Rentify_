// src/components/common/UserDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Heart,
  Package,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const UserDropdown = ({ userEmail, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Handle logout
  const handleLogout = () => {
    // Remove any custom auth keys your app sets:
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token"); // <- add if used
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    // Optionally clear ALL, if you don't persist other important data:
    // localStorage.clear();

    setIsOpen(false);
    // Recommendation: navigate to landing page, then reload to clear app state
    navigate("/");
    window.location.reload();
    // Alternative:
    // window.location.href = "/";
  };
  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      href: "/profile",
      description: "View and edit your profile",
    },
    {
      icon: Package,
      label: "My Rentals",
      href: "/my-rentals",
      description: "Track your rental history",
    },
    {
      icon: Package,
      label: "Order Management",
      href: "/orders",
      description: "Manage your bookings and incoming orders",
    },
    {
      icon: Heart,
      label: "Favorite",
      href: "/favorite",
      description: "Items you've saved",
    },
    {
      icon: CreditCard,
      label: "Payments & Bills",
      href: "/orders", // ✅ Users see bills in order management
      description: "View your invoices and payments",
    },
    // {
    //   icon: Settings,
    //   label: "Settings",
    //   href: "/settings",
    //   description: "Account preferences",
    // },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/contact",
      description: "Get help and contact us",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
          {getUserInitials()}
        </div>

        {/* User Info (Hidden on mobile) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900 truncate max-w-32">
            {userName || userEmail?.split("@")[0]}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group text-left"
            >
              <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                  Sign out
                </div>
                <div className="text-xs text-gray-500">
                  Sign out of your account
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
