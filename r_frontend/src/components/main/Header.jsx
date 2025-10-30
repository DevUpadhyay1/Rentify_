import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogIn,
  PlusCircle,
  User,
  Menu,
  X,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";
import UserDropdown from "../common/UserDropdown";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  const menu = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  // Clear all user session data
  const clearUserSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("profile_image");
    localStorage.removeItem("user_id");
    localStorage.removeItem("refresh");
    setUser(null);
    setPendingReviewsCount(0);
  };

  // Verify token is still valid
  const verifyToken = async (token) => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      // Token is invalid or expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token expired or invalid - clearing session");
        clearUserSession();
        return false;
      }
      // Network error - keep existing session
      return true;
    }
  };

  // Fetch pending reviews count
  const fetchPendingReviewsCount = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/pending/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingReviewsCount(response.data.length || 0);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token expired during this request
        clearUserSession();
      }
      setPendingReviewsCount(0);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // ✅ Start loading
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("user_email");
      const userName = localStorage.getItem("user_name");
      const avatar = localStorage.getItem("profile_image");

      if (token && userEmail) {
        // Verify token is still valid
        const isValid = await verifyToken(token);
        if (isValid) {
          setUser({ email: userEmail, name: userName, avatar });
          // Fetch pending reviews count
          await fetchPendingReviewsCount(token);
        } else {
          // Token invalid - user session already cleared
          // Redirect to login if on protected route
          const protectedRoutes = [
            "/profile",
            "/items/add",
            "/my-rentals",
            "/orders",
            "/reviews",
          ];
          if (
            protectedRoutes.some((route) => location.pathname.startsWith(route))
          ) {
            navigate("/login", { replace: true });
          }
        }
      } else {
        // No token found - ensure everything is cleared
        setUser(null);
        setPendingReviewsCount(0);
      }

      setLoading(false); // ✅ End loading
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Global axios interceptor for token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Global interceptor: Token expired - clearing session");
          clearUserSession();

          // Redirect to login if on protected route
          const protectedRoutes = [
            "/profile",
            "/items/add",
            "/my-rentals",
            "/orders",
            "/reviews",
          ];
          if (
            protectedRoutes.some((route) =>
              window.location.pathname.startsWith(route)
            )
          ) {
            navigate("/login", { replace: true });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/609/609803.png"
                  alt="Rentify Logo"
                  className="w-7 h-7 brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rentify
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Rent Smarter
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menu.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    location.pathname === item.to
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {item.name}
                {location.pathname === item.to && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth & Actions */}
          <div className="flex items-center gap-3">
            {/* ✅ Show loading state */}
            {loading ? (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            ) : (
              <>
                {/* User Actions - Desktop */}
                {user && (
                  <>
                    {/* Pending Reviews Badge */}
                    <Link
                      to="/reviews/pending"
                      className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all relative"
                      title="Pending Reviews"
                    >
                      <Star size={20} />
                      {pendingReviewsCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {pendingReviewsCount}
                        </span>
                      )}
                    </Link>

                    {/* My Reviews Link */}
                    <Link
                      to="/reviews"
                      className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="My Reviews"
                    >
                      <MessageSquare size={20} />
                    </Link>

                    {/* Add Item Button */}
                    <button
                      onClick={() => navigate("/items/add")}
                      className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                      title="List your product for rent"
                    >
                      <PlusCircle size={18} />
                      <span>Add Item</span>
                    </button>
                  </>
                )}

                {user ? (
                  // User Dropdown
                  <div className="hidden lg:block">
                    <UserDropdown
                      userEmail={user.email}
                      userName={user.name}
                      avatar={user.avatar}
                      onLogout={clearUserSession}
                    />
                  </div>
                ) : (
                  // Login Button - Desktop
                  <Link
                    to="/login"
                    className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Login or create account"
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2 mb-4">
              {menu.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      location.pathname === item.to
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              {/* ✅ Show loading state for mobile */}
              {loading ? (
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Loading...</span>
                </div>
              ) : user ? (
                <>
                  {/* Review Links - Mobile */}
                  <Link
                    to="/reviews/pending"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-gray-700" />
                      <span className="text-sm font-semibold text-gray-700">
                        Pending Reviews
                      </span>
                    </div>
                    {pendingReviewsCount > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {pendingReviewsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/reviews/my-reviews"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <MessageSquare size={18} className="text-gray-700" />
                    <span className="text-sm font-semibold text-gray-700">
                      My Reviews
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      navigate("/items/add");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md"
                  >
                    <PlusCircle size={18} />
                    <span>Add Item</span>
                  </button>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl shadow-md"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
