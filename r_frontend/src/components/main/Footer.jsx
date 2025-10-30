
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Heart,
  Shield,
  Users,
  Clock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
// Note: Import axios in your actual project: import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [popularCities, setPopularCities] = useState([]);
  const [footerStats, setFooterStats] = useState({
    users: '50K+',
    items: '100K+',
    cities: '25+'
  });

  // Indian cities where Rentify provides services
  const serviceCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar'
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Safety Guidelines', href: '/safety' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const categories = [
    { name: 'Electronics', href: '/category/electronics' },
    { name: 'Furniture', href: '/category/furniture' },
    { name: 'Vehicles', href: '/category/vehicles' },
    { name: 'Tools & Equipment', href: '/category/tools' },
    { name: 'Sports & Fitness', href: '/category/sports' },
    { name: 'Books & Education', href: '/category/books' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refund' }
  ];

  useEffect(() => {
    // Fetch popular cities and stats from backend
    // const fetchFooterData = async () => {
    //   try {
    //     const [citiesResponse, statsResponse] = await Promise.all([
    //       axios.get('/api/cities/popular'),
    //       axios.get('/api/stats/footer')
    //     ]);
    //     setPopularCities(citiesResponse.data);
    //     setFooterStats(statsResponse.data);
    //   } catch (error) {
    //     console.error('Error fetching footer data:', error);
    //   }
    // };
    
    // fetchFooterData();

    // Mock data for demo (remove in production)
    setPopularCities(serviceCities.slice(0, 12));
  }, []);

  const handleNewsletterSubmit = async () => {
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('');

    try {
      // const response = await axios.post('/api/newsletter/subscribe', {
      //   email: email.trim()
      // });
      
      // Mock success response
      setTimeout(() => {
        setSubscriptionStatus('success');
        setEmail('');
        setIsSubscribing(false);
      }, 1000);

      console.log('Newsletter subscription:', email);
    } catch (error) {
      setSubscriptionStatus('error');
      setIsSubscribing(false);
      console.error('Newsletter subscription error:', error);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/rentify', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/rentify', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/rentify', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/rentify', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/rentify', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info & Newsletter */}
            <div className="lg:col-span-1 space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Rentify
                  </h3>
                  <p className="text-gray-300 text-sm">Rent Made Easy</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                India's most trusted peer-to-peer rental platform. Rent anything, anytime, anywhere with complete safety and convenience.
              </p>

              {/* Stats */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{footerStats.users}</div>
                  <div className="text-xs text-gray-400">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{footerStats.items}</div>
                  <div className="text-xs text-gray-400">Items Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">{footerStats.cities}</div>
                  <div className="text-xs text-gray-400">Cities</div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Stay Updated</h4>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                      disabled={isSubscribing}
                    />
                    <button
                      onClick={handleNewsletterSubmit}
                      disabled={isSubscribing || !email.trim()}
                      className="absolute right-2 top-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-200"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  {subscriptionStatus === 'success' && (
                    <p className="text-green-400 text-xs">✅ Successfully subscribed!</p>
                  )}
                  {subscriptionStatus === 'error' && (
                    <p className="text-red-400 text-xs">❌ Subscription failed. Please try again.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4">
                <h5 className="font-medium text-white text-sm">Why Choose Us?</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300 text-xs">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>100% Verified Users</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-xs">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-xs">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Insurance Coverage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories & Cities */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white text-lg mb-4">Popular Categories</h4>
                <ul className="space-y-3">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a
                        href={category.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center group"
                      >
                        <ChevronRight className="w-3 h-3 mr-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6">
              <h4 className="font-semibold text-white text-lg">Get in Touch</h4>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 text-sm">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 text-sm">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>support@rentify.in</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 text-pink-400 mt-0.5" />
                  <span>123 Tech Park, Bangalore<br />Karnataka, India - 560001</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="font-medium text-white text-sm mb-3">Follow Us</h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/10 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                        aria-label={social.label}
                      >
                        <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* App Download */}
              <div>
                {/* <h5 className="font-medium text-white text-sm mb-3">Download Our App</h5> */}
                {/* <div className="space-y-2">
                  <a href="#" className="block w-full">
                    <div className="bg-black/50 hover:bg-black/70 rounded-lg px-3 py-2 transition-all duration-200 border border-white/10">
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="text-sm font-semibold text-white">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="block w-full">
                    <div className="bg-black/50 hover:bg-black/70 rounded-lg px-3 py-2 transition-all duration-200 border border-white/10">
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="text-sm font-semibold text-white">Google Play</div>
                    </div>
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          {/* Service Cities */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h4 className="font-semibold text-white text-lg mb-6 text-center">We Serve in {footerStats.cities} Cities Across India</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {popularCities.map((city, index) => (
                <a
                  key={index}
                  href={`/city/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-center py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200 border border-white/5 hover:border-white/20"
                >
                  {city}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © 2025 Rentify. All rights reserved. Made with{' '}
                <Heart className="w-4 h-4 text-red-400 inline mx-1" />
                in India
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;