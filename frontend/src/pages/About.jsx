import React from "react";

const About = () => {
  const reviews = [
    {
      userPhoto: "https://via.placeholder.com/100",
      username: "John Doe",
      rating: 5,
      review: "Amazing platform! The UI is so intuitive, and I love the real-time messaging feature.",
    },
    {
      userPhoto: "https://via.placeholder.com/100",
      username: "Jane Smith",
      rating: 4,
      review: "Great app, but I wish there were more customization options for themes.",
    },
    {
      userPhoto: "https://via.placeholder.com/100",
      username: "Alex Johnson",
      rating: 5,
      review: "The end-to-end encryption gives me peace of mind. Highly recommend it!",
    },
  ];

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

        {/* Reviews Section */}
        <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-8">User Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
            >
              {/* User Photo */}
              <img
                src={review.userPhoto}
                alt={`${review.username}'s profile`}
                className="w-20 h-20 rounded-full mb-4 border-4 border-yellow-400"
              />
              {/* User Info */}
              <h3 className="text-lg font-bold mb-1">{review.username}</h3>
              {/* Star Rating */}
              <div className="flex justify-center items-center mb-2">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">&#9733;</span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <span key={i} className="text-gray-500 text-xl">&#9733;</span>
                ))}
              </div>
              {/* Review Text */}
              <p className="text-sm opacity-80">{review.review}</p>
            </div>
          ))}
        </div>

        {/* Contact Us Button */}
        <button
          onClick={() => window.open("mailto:driverbaby307@gmail.com")}
          className="mt-12 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-xl transform transition duration-500 hover:bg-yellow-300 hover:scale-110"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;



