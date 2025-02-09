import React from 'react';
import { useNavigate } from 'react-router-dom';
import giblie from "../assets/images/giblie.gif";

const Body = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow bg-gradient-to-r from-blue-800 via-purple-900 to-black text-white py-24 px-6 relative overflow-hidden flex items-center justify-center min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row w-full items-center">
        
        {/* Left Section (Text + Button) */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 transform transition-all duration-500 ease-in-out hover:scale-105" style={{ fontFamily: 'fish' }}>
            Connect with People Like Never Before
          </h1>
          <p className="text-sm md:text-lg lg:text-2xl mb-8 opacity-80 transform transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-100" style={{ fontFamily: 'fish' }}>
            Chat, date, and build relationships seamlessly with our advanced platform.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 md:px-10 md:py-4 bg-gradient-to-r from-blue-400 to-purple-500 text-black font-bold rounded-full shadow-xl transform transition duration-500 hover:bg-blue-300 hover:scale-110"
            style={{ fontFamily: 'fish' }}
          >
            Start Chatting Now
          </button>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img src={giblie} alt="Chatting GIF" className="max-w-full h-auto w-3/4 md:w-1/2 lg:w-full" />
        </div>
      </div>
    </div>
  );
};

export default Body;
