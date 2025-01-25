import React from "react";
import vishal from "../assets/images/vishal.jpg";
import kamlesh from "../assets/images/kamlesh.jpg";
import chirag from "../assets/images/chirag.jpg";
import fullstack from "../assets/images/fullstack.webp";
import frontend from "../assets/images/frontend.jpg";
import backend from "../assets/images/backend.jpg";

const Developers = () => {
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-center mb-12" style={{ fontFamily: 'box' }}>
          Meet Our Developers
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Developer 1 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center group">
            <div className="relative w-32 h-32 mx-auto rounded-full mb-4">
              <img src={frontend} alt="Frontend" className="w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
              <img src={chirag} alt="Vishal" className="w-full h-full rounded-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: 'box' }}>Chirag Sharma</h2>
            <p className="text-lg">Frontend Developer</p>
            <p className="mt-4">frontend development and has a passion for creating stunning user interfaces.</p>
          </div>

          {/* Developer 2 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center group">
            <div className="relative w-32 h-32 mx-auto rounded-full mb-4">
              <img src={backend} alt="Backend" className="w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
              <img src={kamlesh} alt="Kamlesh" className="w-full h-full rounded-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: 'box' }}>kamlesh kumar</h2>
            <p className="text-lg">Backend Developer</p>
            <p className="mt-4">backend development and ensures our systems run smoothly and efficiently.</p>
          </div>

          {/* Developer 3 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center group">
            <div className="relative w-32 h-32 mx-auto rounded-full mb-4">
              <img src={fullstack} alt="Full Stack" className="w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
              <img src={vishal} alt="Chirag" className="w-full h-full rounded-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100" />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: 'box' }}>benukar pal</h2>
            <p className="text-lg">Full Stack Developer</p>
            <p className="mt-4">full stack developer with a knack for solving complex problems and building robust applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;