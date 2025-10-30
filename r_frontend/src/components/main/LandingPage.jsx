import React, { useState, useEffect } from 'react';
import { 
  Filter, Grid, List, Star, Eye, Calendar, TrendingUp, Award, Zap, 
  ArrowRight, ChevronDown, SlidersHorizontal, MapPin, Clock, Heart,
  Smartphone, Car, Home as HomeIcon, Wrench, Gamepad2, Book, Camera,
  Dumbbell, Music, Baby, Plane, ShoppingBag, Laptop
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

// Filter Component
const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Vadodara'];
  const priceRanges = [
    { label: 'Under ₹100', value: '0-100' },
    { label: '₹100 - ₹500', value: '100-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: 'Above ₹2000', value: '2000+' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-6 mb-8 border border-gray-200/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2 text-blue-600" />
          Filters
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Any Price</option>
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={onApplyFilters}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onClick }) => (
  <div
    onClick={() => onClick(category)}
    className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50 hover:border-blue-300/50"
  >
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {category.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
        {category.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <span className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {category.itemCount} items
        </span>
        <span className="flex items-center">
          <Star className="w-3 h-3 mr-1 text-yellow-500" />
          {category.rating}
        </span>
      </div>
    </div>
  </div>
);

// Item Card Component
const ItemCard = ({ item, onRentClick }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 overflow-hidden group">
    <div className="relative">
      <img 
        src={item.images?.[0] || '/api/placeholder/300/200'} 
        alt={item.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {item.category}
        </span>
      </div>
      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100">
        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
      </button>
      {item.isPopular && (
        <div className="absolute top-3 right-3 left-3 flex justify-between items-start">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Popular
          </span>
        </div>
      )}
    </div>
    
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">{item.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>{item.views} views</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-800">₹{item.pricePerDay}</span>
          <span className="text-sm text-gray-500">/day</span>
        </div>
        <button
          onClick={() => onRentClick(item)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Rent Now</span>
        </button>
      </div>
    </div>
  </div>
);

// Subcategory Section Component
const SubcategorySection = ({ subcategories, onSubcategoryClick }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Browse by Subcategories</h2>
      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors duration-200">
        <span>View All</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          onClick={() => onSubcategoryClick(subcategory)}
          className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 text-center"
        >
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {subcategory.icon}
          </div>
          <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {subcategory.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{subcategory.itemCount} items</p>
        </div>
      ))}
    </div>
  </div>
);

// Hero Section Component
const HeroSection = () => (
  <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 mb-12 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
        Rent Anything, Anytime
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Discover thousands of items available for rent in your city. From electronics to furniture, tools to vehicles - find what you need when you need it.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
          Start Browsing
        </button>
        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
          List Your Item
        </button>
      </div>
    </div>
  </div>
);

// Main Landing Page Component
const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    rating: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  // Mock data - replace with actual API calls
  const mockCategories = [
    { id: 1, name: 'Electronics', description: 'Phones, Laptops, Cameras', icon: <Smartphone className="w-8 h-8 text-white" />, itemCount: 1250, rating: 4.5 },
    { id: 2, name: 'Vehicles', description: 'Cars, Bikes, Scooters', icon: <Car className="w-8 h-8 text-white" />, itemCount: 890, rating: 4.3 },
    { id: 3, name: 'Furniture', description: 'Chairs, Tables, Sofas', icon: <HomeIcon className="w-8 h-8 text-white" />, itemCount: 760, rating: 4.4 },
    { id: 4, name: 'Tools', description: 'Power Tools, Hand Tools', icon: <Wrench className="w-8 h-8 text-white" />, itemCount: 540, rating: 4.6 },
    { id: 5, name: 'Gaming', description: 'Consoles, Games, VR', icon: <Gamepad2 className="w-8 h-8 text-white" />, itemCount: 320, rating: 4.7 },
    { id: 6, name: 'Books', description: 'Textbooks, Novels, Comics', icon: <Book className="w-8 h-8 text-white" />, itemCount: 680, rating: 4.2 }
  ];

  const mockSubcategories = [
    { id: 1, name: 'Cameras', icon: <Camera className="w-6 h-6 text-white" />, itemCount: 125 },
    { id: 2, name: 'Laptops', icon: <Laptop className="w-6 h-6 text-white" />, itemCount: 340 },
    { id: 3, name: 'Fitness', icon: <Dumbbell className="w-6 h-6 text-white" />, itemCount: 89 },
    { id: 4, name: 'Music', icon: <Music className="w-6 h-6 text-white" />, itemCount: 156 },
    { id: 5, name: 'Baby Care', icon: <Baby className="w-6 h-6 text-white" />, itemCount: 67 },
    { id: 6, name: 'Travel', icon: <Plane className="w-6 h-6 text-white" />, itemCount: 234 }
  ];

  const mockItems = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with excellent camera quality, perfect for photography and daily use.',
      category: 'Electronics',
      subcategory: 'Smartphones',
      pricePerDay: 150,
      location: 'Mumbai',
      rating: 4.8,
      views: 1240,
      images: ['/api/placeholder/300/200'],
      isPopular: true,
      owner: { name: 'John Doe', rating: 4.9 }
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      description: 'High-performance laptop ideal for creative work, programming, and professional tasks.',
      category: 'Electronics',
      subcategory: 'Laptops',
      pricePerDay: 200,
      location: 'Bangalore',
      rating: 4.9,
      views: 890,
      images: ['/api/placeholder/300/200'],
      isPopular: true,
      owner: { name: 'Jane Smith', rating: 4.8 }
    },
    {
      id: 3,
      title: 'Honda City 2023',
      description: 'Comfortable sedan perfect for city drives and long trips. Well-maintained vehicle.',
      category: 'Vehicles',
      subcategory: 'Cars',
      pricePerDay: 800,
      location: 'Delhi',
      rating: 4.6,
      views: 2100,
      images: ['/api/placeholder/300/200'],
      isPopular: false,
      owner: { name: 'Mike Johnson', rating: 4.7 }
    },
    {
      id: 4,
      title: 'Canon EOS R5',
      description: 'Professional camera with 45MP sensor, perfect for weddings and professional photography.',
      category: 'Electronics',
      subcategory: 'Cameras',
      pricePerDay: 300,
      location: 'Hyderabad',
      rating: 4.7,
      views: 567,
      images: ['/api/placeholder/300/200'],
      isPopular: true,
      owner: { name: 'Sarah Wilson', rating: 4.9 }
    },
    {
      id: 5,
      title: 'Gaming Chair Pro',
      description: 'Ergonomic gaming chair with RGB lighting and premium comfort for long gaming sessions.',
      category: 'Furniture',
      subcategory: 'Chairs',
      pricePerDay: 50,
      location: 'Pune',
      rating: 4.4,
      views: 324,
      images: ['/api/placeholder/300/200'],
      isPopular: false,
      owner: { name: 'Alex Brown', rating: 4.6 }
    },
    {
      id: 6,
      title: 'Power Drill Set',
      description: 'Complete power drill set with multiple bits, perfect for home improvement projects.',
      category: 'Tools',
      subcategory: 'Power Tools',
      pricePerDay: 75,
      location: 'Chennai',
      rating: 4.5,
      views: 445,
      images: ['/api/placeholder/300/200'],
      isPopular: false,
      owner: { name: 'David Lee', rating: 4.8 }
    }
  ];

  // Simulate API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, these would be actual API calls:
        // const categoriesResponse = await axios.get('/api/categories');
        // const subcategoriesResponse = await axios.get('/api/subcategories');
        // const popularItemsResponse = await axios.get('/api/items/popular');
        // const allItemsResponse = await axios.get('/api/items');
        
        setCategories(mockCategories);
        setSubcategories(mockSubcategories);
        setPopularItems(mockItems.filter(item => item.isPopular));
        setAllItems(mockItems);
        setFilteredItems(mockItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on selected filters
  const applyFilters = () => {
    let filtered = [...allItems];

    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(item => item.pricePerDay >= min && item.pricePerDay <= max);
      } else {
        filtered = filtered.filter(item => item.pricePerDay >= min);
      }
    }

    if (filters.rating) {
      filtered = filtered.filter(item => item.rating >= parseFloat(filters.rating));
    }

    setFilteredItems(filtered);
    console.log('Applied filters:', filters);
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // Navigate to category page or filter items
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log('Subcategory clicked:', subcategory);
    // Navigate to subcategory page or filter items
  };

  const handleRentClick = (item) => {
    console.log('Rent item:', item);
    // Navigate to item details or booking page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Add your Header component here */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing items for you...</p>
          </div>
        </div>
        {/* Add your Footer component here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Import and use your Header component here */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Popular Categories</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors duration-200">
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>

        {/* Popular Items Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-orange-500" />
              Trending Rentals
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors duration-200">
              <span>View All Trending</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onRentClick={handleRentClick}
              />
            ))}
          </div>
        </div>

        {/* Subcategories Section */}
        <SubcategorySection 
          subcategories={subcategories}
          onSubcategoryClick={handleSubcategoryClick}
        />

        {/* Filter Section */}
        <FilterSection 
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={applyFilters}
        />

        {/* All Items Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">All Items ({filteredItems.length})</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onRentClick={handleRentClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => {
                  setFilters({ location: '', priceRange: '', rating: '' });
                  setFilteredItems(allItems);
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import and use your Footer component here */}
      <Footer />
    </div>
  );
};

export default LandingPage;