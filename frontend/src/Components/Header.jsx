import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle
  const location = useLocation(); // Get current location

  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide "style={{ fontFamily: 'box' }}>
          Chat-Zone
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className={`text-lg font-medium hover:text-blue-300 transition-all duration-300 ${
              location.pathname === "/" ? "text-blue-300" : "hover:scale-105"
            }`}
            style={{ fontFamily: 'wall' }}
          >
            Home
          </Link>
          <Link
            to="/Reviews"
            className={`text-lg font-medium hover:text-blue-300 transition-all duration-300 ${
              location.pathname === "/Reviews" ? "text-blue-300" : "hover:scale-105" 
            }`}
            style={{ fontFamily: 'wall' }}  
          >
            Reviews
          </Link>
          <Link
            to="/features"
            className="text-lg font-medium hover:text-blue-300 transition-all duration-300 hover:scale-105"
            style={{ fontFamily: 'wall' }}
          >
            Features
          </Link>
          <Link
            to="/developers"
            className={`text-lg font-medium hover:text-blue-300 transition-all duration-300 ${
              location.pathname === "/developers" ? "text-blue-300" : "hover:scale-105"
            }`}
            style={{ fontFamily: 'wall' }}
          >
            Developers
          </Link>
          <Link
            to="/login"
            className={`text-lg font-medium hover:text-blue-300 transition-all duration-300 ${
              location.pathname === "/login" ? "text-blue-300" : "hover:scale-105"
            }`}
            style={{ fontFamily: 'wall' }}
          >
            Login
          </Link>
        </nav>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav
          className="md:hidden bg-gray-900 mt-4 rounded-lg p-4 shadow-lg"
          aria-label="Mobile navigation menu"
        >
          <ul className="space-y-4 text-center">
            <li>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium hover:text-blue-300 ${
                  location.pathname === "/" ? "text-blue-300" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Reviews"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium hover:text-blue-300 ${
                  location.pathname === "/Reviews" ? "text-blue-300" : ""
                }`}
              >
                Reviews
              </Link>
            </li>
            <li>
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium hover:text-blue-300"
              >
                Features
              </a>
            </li>
            <li>
              <Link
                to="/developers"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium hover:text-blue-300 ${
                  location.pathname === "/developers" ? "text-blue-300" : ""
                }`}
              >
                Developers
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium hover:text-blue-300 ${
                  location.pathname === "/login" ? "text-blue-300" : ""
                }`}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;