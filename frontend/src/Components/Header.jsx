import React from 'react';

const Header = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-8 py-5 shadow-xl rounded-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-5xl font-extrabold tracking-wide glow-effect hover:scale-105 transform transition-all duration-300 ease-in-out">
          Chatting-WebApp
        </h1>
        <ul className="flex space-x-12">
          <li>
            <a
              href="#"
              className="text-xl font-semibold hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-xl font-semibold hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-xl font-semibold hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-xl font-semibold hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
