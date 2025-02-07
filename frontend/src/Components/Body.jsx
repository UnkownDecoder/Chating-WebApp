import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import giblie from "../assets/images/giblie.gif";

const Body = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="flex-grow bg-gradient-to-r from-blue-800 via-purple-900 rotate gradient in 9-degree to-black text-white py-24 px-6 relative overflow-hidden flex items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto flex w-full">
        {/* Left Section */}
        <div className="w-1/2 text-left">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold from-blue-800 mb-6 transform transition-all duration-500 ease-in-out hover:scale-105" style={{ fontFamily: 'fish' }}>
            Connect with People Like Never Before
          </h1>
          <p className="text-sm md:text-lg lg:text-2xl mb-8 opacity-80 transform transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100" style={{ fontFamily: 'fish' }}>
            Chat, date, and build relationships seamlessly with our advanced platform.
          </p>
          <button
            onClick={() => navigate('/register')} // Navigate to Register page
            className="px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-blue-400 to-purple-500 text-black font-bold rounded-full shadow-xl transform transition duration-500 hover:bg-blue-300 hover:scale-110"
            style={{ fontFamily: 'fish' }}
          >
            Start Chatting Now
          </button>
        </div>
        {/* Right Section */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={giblie} alt="Chatting GIF" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Body;