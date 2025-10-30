import React, { useState, useEffect } from 'react';
import { Menu, X, User, Home, Plus, Search, Bell, Heart, MapPin } from 'lucide-react';
// Note: Import axios in your actual project: import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be managed by your auth state
  const [user, setUser] = useState(null); // User data from backend
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  // Example of how you would fetch user data from backend
  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     const response = await axios.get('/api/user/profile', {
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       }
    //     });
    //     setUser(response.data);
    //     setIsLoggedIn(true);
    //   } catch (error) {
    //     setIsLoggedIn(false);
    //   }
    // };
    
    // Check if user is logged in (replace with your actual auth logic)
    // fetchUserData();
    
    // Mock login state for demo (remove this in production)
    setIsLoggedIn(false); // Change to true to see logged in state
    
    // Mock search suggestions
    setSearchSuggestions([
      'Electronics', 'Furniture', 'Cars', 'Tools', 'Books', 'Gaming'
    ]);
  }, []);

  // Handle search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Here you would typically make an API call to get search suggestions
    // const fetchSuggestions = async () => {
    //   try {
    //     const response = await axios.get(`/api/search/suggestions?q=${e.target.value}`);
    //     setSearchSuggestions(response.data);
    //   } catch (error) {
    //     console.error('Error fetching suggestions:', error);
    //   }
    // };
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Here you would navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    // Handle login logic or redirect to login page
    console.log('Login clicked');
  };

  const handleRegister = () => {
    // Handle register logic or redirect to register page
    console.log('Register clicked');
  };

  const handleProfile = () => {
    // Handle profile navigation
    console.log('Profile clicked');
  };

  const handleRentItem = () => {
    // Handle rent item navigation
    console.log('Rent Item clicked');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 group cursor-pointer">
              {/* App Logo with animation */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Home className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Rentify
              </h1>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">Rent Made Easy</span>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search for items to rent..."
                  className="w-full pl-12 pr-6 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded border">⌘K</kbd>
                </div>
              </div>
              
              {/* Search Suggestions */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">Popular Categories</div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors duration-150"
                    >
                      <Search className="w-4 h-4 text-gray-400 inline mr-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Rent Item Button */}
            <button
              onClick={handleRentItem}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">List Item</span>
            </button>

            {/* Authentication Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Favorites */}
                <button className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200 hover:bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>Profile</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 px-6 py-2 rounded-xl hover:bg-gray-50 relative overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={handleRegister}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-transparent px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden group"
                >
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-50 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for items..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300"
            />
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-4">
              {/* Rent Item Button */}
              <button
                onClick={handleRentItem}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>List Item</span>
              </button>

              {/* Authentication Buttons */}
              {isLoggedIn ? (
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-3 bg-gray-50 rounded-xl">
                    <Bell className="w-5 h-5" />
                    <span>Notifications ({notifications})</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-red-500 font-medium transition-colors duration-200 py-3 bg-gray-50 rounded-xl">
                    <Heart className="w-5 h-5" />
                    <span>Favorites</span>
                  </button>
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-3 bg-gray-50 rounded-xl"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleLogin}
                    className="w-full text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegister}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;