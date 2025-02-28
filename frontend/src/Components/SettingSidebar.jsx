import React from 'react';
import { FaSearch, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SettingsSidebar = ({ activeSection, setActiveSection, handleLogoutClick, searchQuery, setSearchQuery, setIsSidebarVisible }) => {
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 768) { // Check if the screen width is less than 768px (mobile)
      setIsSidebarVisible(false); // Hide sidebar on mobile after selecting a section
    }
  };

  const handleCloseClick = () => {
    navigate('/chat'); // Redirect to the chat page
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex flex-col justify-between w-full md:w-1/4 h-full md:h-auto fixed md:relative z-50 md:z-auto">
      <div className="flex flex-col mb-4">
        <div className="relative flex items-center mb-4">
          <button
            onClick={handleCloseClick}
            className="md:hidden text-gray-500 hover:text-gray-200 mr-2"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pr-10 pl-10 border border-gray-600 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-6">
          <span className="text-white font-bold text-sm">USER SETTINGS</span>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <button onClick={() => handleSectionClick('My Account')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'My Account' ? 'bg-gray-600' : ''}`}>My Account</button>
          <button onClick={() => handleSectionClick('My Profile')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'My Profile' ? 'bg-gray-600' : ''}`}>My Profile</button>
        </div>
        <hr className="my-4 border-gray-600" />
        <div className="flex items-center mt-4">
          <span className="text-white font-bold text-sm">APP SETTINGS</span>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <button onClick={() => handleSectionClick('Appearance')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Appearance' ? 'bg-gray-600' : ''}`}>Appearance</button>
        </div>
        <hr className="my-4 border-gray-600" />
        <button
          onClick={handleLogoutClick}
          className="bg-transparent text-left text-red-500 py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsSidebar;