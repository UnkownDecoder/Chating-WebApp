import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ChicoImage from "../assets/images/chico.jpg";
import DaddyImage from "../assets/images/daddy.jpg";
import MommyImage from "../assets/images/mommy.jpg";

const About = () => {
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const reviews = [
    {
      userPhoto: ChicoImage,
      username: "Vishal",
      rating: 5,
      review: "Amazing platform! The UI is so intuitive, and I love the real-time messaging feature.",
    },
    {
      userPhoto: DaddyImage,
      username: "Arjun",
      rating: 4,
      review: "Great app, but I wish there were more customization options for themes.",
    },
    {
      userPhoto: MommyImage,
      username: "Shreya",
      rating: 5,
      review: "The end-to-end encryption gives me peace of mind. Highly recommend it!",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="flex-grow bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-24 px-6 relative">
      {/* About Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold glow-effect mb-6 transform transition-all duration-500 ease-in-out">
          our reviews
        </h1>
        <p className="text-sm md:text-lg lg:text-2xl mb-8 opacity-80 transform transition-all duration-300 ease-in-out">
          Discover a platform where real-time communication meets simplicity and security.
        </p>

        {/* Reviews Section */}
        <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-8">User Reviews</h2>
        <div className="bg-gray-700 p-6 rounded-xl shadow-lg max-w-md mx-auto">
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={index} className="p-4">
                <img src={review.userPhoto} alt={review.username} className="w-24 h-24 rounded-full mx-auto" />
                <h3 className="text-xl font-bold text-center mt-4">{review.username}</h3>
                <div className="flex justify-center items-center mb-2">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">&#9733;</span>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, i) => (
                    <span key={i} className="text-gray-500 text-xl">&#9733;</span>
                  ))}
                </div>
                <p className="text-center mt-2">{review.review}</p>
              </div>
            ))}
          </Slider>
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