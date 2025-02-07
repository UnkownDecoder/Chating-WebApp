import React from 'react';
import { FaGithub, FaHackerrank, FaInstagram } from 'react-icons/fa'; // Using react-icons for logos

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8 mt-auto shadow-xl">
      <div className="max-w-7xl mx-auto text-center">
        {/* Footer Text with Glow Effect */}
        <p className="text-lg font-semibold glow-effect mb-6">
          Created By Benukar , Chirag , Kamlesh
        </p>

        {/* Social Media Icons with Hover Effects */}
        <div className="flex justify-center space-x-8 mt-4">
          {/* HackerRank Icon */}
          <a
            href="https://www.hackerrank.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gradient transition duration-300 transform hover:scale-125"
          >
            <FaHackerrank className="transition-all duration-300 transform hover:rotate-12 hover:text-purple-500" />
          </a>
          
          {/* GitHub Icon */}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gradient transition duration-300 transform hover:scale-125"
          >
            <FaGithub className="transition-all duration-300 transform hover:rotate-12 hover:text-gray-500" />
          </a>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gradient transition duration-300 transform hover:scale-125"
          >
            <FaInstagram className="transition-all duration-300 transform hover:rotate-12 hover:text-pink-500" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;