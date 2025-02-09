import React from "react";
import { FaComments, FaUsers, FaUserEdit, FaShareAlt, FaLock, FaDesktop } from "react-icons/fa"; // Importing icons

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold glow-effect mb-12">
          Our Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaComments className="text-4xl text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Real-Time Messaging</h3>
            <p className="text-gray-300">
              Send and receive messages instantly with our lightning-fast real-time chat.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaUsers className="text-4xl text-green-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Group Chats</h3>
            <p className="text-gray-300">
              Create and manage group chats to connect with multiple people effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaUserEdit className="text-4xl text-purple-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Profile Customization</h3>
            <p className="text-gray-300">
              Personalize your profile with photos, banners, and unique bios.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaShareAlt className="text-4xl text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Media Sharing</h3>
            <p className="text-gray-300">
              Share photos, videos, and documents seamlessly with friends.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaLock className="text-4xl text-red-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Privacy and Security</h3>
            <p className="text-gray-300">
              Enjoy end-to-end encryption and advanced privacy features.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            <FaDesktop className="text-4xl text-teal-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-4">Cross-Platform Access</h3>
            <p className="text-gray-300">
              Use Chat-Zone on web, mobile, or desktop for a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;