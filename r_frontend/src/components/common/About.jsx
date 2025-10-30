import React from "react";
import {
  ShieldCheck,
  Users,
  Sparkles,
  Heart,
  Target,
  TrendingUp,
  CheckCircle,
  Award,
  Globe,
  Leaf,
} from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Users,
      label: "Happy Customers",
      value: "50,000+",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Award,
      label: "Verified Products",
      value: "10,000+",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Globe,
      label: "Cities Covered",
      value: "100+",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      label: "Growth Rate",
      value: "300%",
      color: "from-orange-500 to-red-600",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Transactions",
      description:
        "End-to-end encrypted payments with buyer protection guarantee",
      gradient: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "Trusted Community",
      description:
        "Verified users and partners creating a reliable rental ecosystem",
      gradient: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description:
        "Curated selection of top-rated products across all categories",
      gradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
    },
    {
      icon: Leaf,
      title: "Sustainable Living",
      description: "Reduce waste and carbon footprint through smart sharing",
      gradient: "from-teal-50 to-cyan-50",
      iconColor: "text-teal-600",
    },
  ];

  const values = [
    "Wide selection of verified products from trusted partners",
    "24/7 customer support with dedicated account managers",
    "Transparent pricing with no hidden charges",
    "Flexible rental periods from daily to yearly",
    "Easy returns and hassle-free cancellation policy",
    "Insurance coverage on all premium rentals",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              India's Most Trusted Rental Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              Welcome to <span className="text-yellow-300">Rentify</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Making smart renting simple, accessible, and secure for everyone
              across India
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Rentify, we're revolutionizing the way India thinks about
            consumption. Our mission is to create a sustainable, flexible future
            where access trumps ownership. Whether you need electronics,
            vehicles, furniture, or event equipment, we connect you with
            verified partners offering premium products—without the burden of
            ownership.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 font-medium">
                We believe renting is the smarter way to live—flexible,
                sustainable, and hassle-free. By choosing Rentify, you're not
                just saving money; you're contributing to a greener planet and a
                more connected community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Rentify?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-white shadow-lg mb-4`}
              >
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-1 flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Rentify Revolution
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience the future of smart living with thousands of satisfied
              customers across India
            </p>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Start Renting Today
            </button>
          </div>
        </div>
      </div>

      {/* Thank You Note */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-t border-indigo-200">
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-gray-800 font-semibold">
              Thank you for choosing Rentify! Together, we're building a
              smarter, greener future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
