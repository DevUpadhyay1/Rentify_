import React from "react";
import {
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Heart,
  MapPin,
  ChevronRight,
} from "lucide-react";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Kolkata",
  "Ahmedabad",
  "Surat",
];

const quickLinks = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
  { name: "My Account", to: "/profile" },
];

function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand/About */}
        <div>
          <div className="flex items-center gap-3 mb-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/609/609803.png"
                  alt="Rentify Logo"
                  className="w-7 h-7 brightness-0 invert"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rentify
              </span>
              <span className="text-xs text-slate-400 font-medium -mt-1">
                Rent Smarter
              </span>
            </div>
          </div>
          <p className="max-w-xs text-slate-300 text-sm mb-4 leading-relaxed">
            Rentify connects you to India's top rental products: affordable,
            secure, and eco-friendly. Discover, list, and rent in seconds!
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="mailto:support@rentify.com"
              className="hover:text-blue-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Popular Cities */}
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
            <MapPin size={18} className="text-blue-400" /> Popular Cities
          </h4>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                className="bg-slate-800 px-3 py-1.5 rounded-md text-sm text-slate-300 hover:bg-slate-700 transition-colors cursor-default border border-slate-700"
                key={city}
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
            <ChevronRight size={18} className="text-blue-400" /> Quick Links
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <a
                  href={link.to}
                  className="hover:text-blue-400 transition-colors text-slate-300 flex items-center gap-2 text-sm"
                >
                  <ChevronRight size={14} className="text-slate-500" />{" "}
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Legal */}
        <div className="text-sm flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="text-slate-300">
              <span className="text-slate-400">Contact:</span>{" "}
              <a
                href="mailto:support@rentify.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@rentify.com
              </a>
            </div>
            <div className="text-slate-400">
              © {new Date().getFullYear()} Rentify Pvt Ltd
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-slate-400 text-sm">
            Made with{" "}
            <Heart className="inline-block w-4 h-4 text-red-500 fill-red-500" />{" "}
            in India
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
          All rights reserved. Rentify is committed to providing secure and
          reliable rental services.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
