import React from 'react';

const Body = () => {
  return (
    <div className="flex-grow bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-24 px-6 relative">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold glow-effect mb-6 transform transition-all duration-500 ease-in-out hover:scale-105">
          Connect with People Like Never Before
        </h1>
        <p className="text-sm md:text-lg lg:text-2xl mb-8 opacity-80 transform transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100">
          Chat, date, and build relationships seamlessly with our advanced platform.
        </p>
        <button className="px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-xl transform transition duration-500 hover:bg-yellow-300 hover:scale-110">
          Start Chatting Now
        </button>
      </div>
    </div>
  );
}

export default Body;


