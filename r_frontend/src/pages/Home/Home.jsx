// import React from "react";
// import { Link } from "react-router-dom";
// import { Search, Package, Shield, TrendingUp, Star, Users } from "lucide-react";
// import { Button, Input, Card } from "../../components/common";

// const Home = () => {
//   const features = [
//     {
//       icon: <Package size={40} />,
//       title: "Wide Selection",
//       description: "Browse thousands of items available for rent in your area",
//     },
//     {
//       icon: <Shield size={40} />,
//       title: "Secure & Safe",
//       description:
//         "Verified users and secure payment processing for peace of mind",
//     },
//     {
//       icon: <TrendingUp size={40} />,
//       title: "Easy to Use",
//       description: "Simple booking process and user-friendly interface",
//     },
//     {
//       icon: <Star size={40} />,
//       title: "Quality Guaranteed",
//       description: "All items are verified and reviewed by our community",
//     },
//   ];

//   const categories = [
//     { name: "Electronics", icon: "📱", count: 1234 },
//     { name: "Vehicles", icon: "🚗", count: 856 },
//     { name: "Tools", icon: "🔧", count: 432 },
//     { name: "Sports", icon: "⚽", count: 678 },
//     { name: "Party & Events", icon: "🎉", count: 345 },
//     { name: "Photography", icon: "📷", count: 234 },
//     { name: "Furniture", icon: "🛋️", count: 567 },
//     { name: "Other", icon: "📦", count: 789 },
//   ];

//   const stats = [
//     { value: "10,000+", label: "Items Available" },
//     { value: "5,000+", label: "Happy Customers" },
//     { value: "50+", label: "Cities Covered" },
//     { value: "4.8/5", label: "Average Rating" },
//   ];

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-20">
//         <div className="container-custom">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Rent Anything, Anytime
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-blue-100">
//               Your trusted marketplace for renting and lending items
//             </p>

//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto mb-8">
//               <form className="flex gap-2">
//                 <Input
//                   type="search"
//                   placeholder="Search for items..."
//                   icon={<Search size={20} />}
//                   className="flex-1"
//                   size="lg"
//                 />
//                 <Button type="submit" size="lg" variant="secondary">
//                   Search
//                 </Button>
//               </form>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button as={Link} to="/items" size="lg" variant="secondary">
//                 Browse Items
//               </Button>
//               <Button
//                 as={Link}
//                 to="/items/add"
//                 size="lg"
//                 variant="outline"
//                 className="border-white text-white hover:bg-white hover:text-blue-600"
//               >
//                 List Your Item
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Decorative Wave */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg
//             viewBox="0 0 1440 120"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
//               fill="currentColor"
//               className="text-gray-50 dark:text-gray-900"
//             />
//           </svg>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
//         <div className="container-custom">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-400">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 bg-gray-50 dark:bg-gray-900">
//         <div className="container-custom">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               Browse by Category
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400">
//               Find exactly what you need from our diverse categories
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {categories.map((category, index) => (
//               <Link
//                 key={index}
//                 to={`/items?category=${category.name.toLowerCase()}`}
//                 className="group"
//               >
//                 <Card
//                   hoverable
//                   className="text-center p-6 transition-all duration-300 hover:shadow-xl"
//                 >
//                   <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
//                     {category.icon}
//                   </div>
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
//                     {category.name}
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {category.count} items
//                   </p>
//                 </Card>
//               </Link>
//             ))}
//           </div>

//           <div className="text-center mt-8">
//             <Button as={Link} to="/items" variant="outline" size="lg">
//               View All Categories
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-white dark:bg-gray-800">
//         <div className="container-custom">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               Why Choose Rentify?
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400">
//               Experience the best rental marketplace
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="text-center">
//                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-16 bg-gray-50 dark:bg-gray-900">
//         <div className="container-custom">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               How It Works
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400">
//               Get started in 3 simple steps
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
//                 1
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 Browse & Search
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Find the perfect item from thousands of listings in your area
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
//                 2
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 Book & Pay
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Select your rental dates and complete secure payment
//               </p>
//             </div>

//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
//                 3
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 Enjoy & Return
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Use the item and return it on time to earn great reviews
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white">
//         <div className="container-custom text-center">
//           <Users size={64} className="mx-auto mb-6 opacity-80" />
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Get Started?
//           </h2>
//           <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
//             Join thousands of users renting and lending items in your community
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button as={Link} to="/register" size="lg" variant="secondary">
//               Sign Up Free
//             </Button>
//             <Button
//               as={Link}
//               to="/items"
//               size="lg"
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-blue-600"
//             >
//               Explore Items
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;
