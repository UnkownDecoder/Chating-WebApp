import React from 'react'

const body = () => {
  return (
    <div className="flex-grow bg-gradient-to-r from-primary to-secondary text-white py-20 px-4 relative">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold glow-effect mb-6">
          Connect with People Like Never Before
        </h1>
        <p className="text-sm md:text-lg lg:text-2xl mb-8">
          Chat, date, and build relationships seamlessly with our advanced platform.
        </p>
        <button className="px-6 py-3 md:px-8 md:py-4 bg-accent text-black font-bold rounded-full shadow-lg hover:bg-yellow-300 transition transform hover:scale-110">
          Start Chatting Now
        </button>
      </div>
    </div>
  )
}

export default body