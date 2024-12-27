import React from 'react';

const About = () => {
  return (
    <div className="flex-grow bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-24 px-6 relative">
      {/* About Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold glow-effect mb-6 transform transition-all duration-500 ease-in-out hover:scale-105">
          About Chat-Zone
        </h1>
        <p className="text-sm md:text-lg lg:text-2xl mb-8 opacity-80 transform transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100">
          Discover a platform where real-time communication meets simplicity and security.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Real-time Messaging</h3>
            <p className="text-sm opacity-80">Experience instant communication with zero delays.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
            <p className="text-sm opacity-80">Your conversations are private and secure.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Custom Themes</h3>
            <p className="text-sm opacity-80">Personalize your chat experience with stunning themes.</p>
          </div>
          {/* Feature 4 */}
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Cross-Platform Support</h3>
            <p className="text-sm opacity-80">Chat seamlessly across all your devices.</p>
          </div>
        </div>
        <button
          onClick={() => window.open('mailto:support@chatconnect.com')} // Navigate to mailto link
          className="mt-12 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-xl transform transition duration-500 hover:bg-yellow-300 hover:scale-110"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
