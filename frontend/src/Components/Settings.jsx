import React, { useState } from 'react';
import { FaSearch, FaSignOutAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import { useAuthStore } from '../store/useAuthStore';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('My Account');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTheme, setSelectedTheme] = useState('Default Theme');

  const handleBackClick = () => {
    window.history.back();
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const languages = [
    { name: 'English', code: 'US', country: 'United States' },
    { name: 'Spanish', code: 'ES', country: 'Spain' },
    { name: 'French', code: 'FR', country: 'France' },
    { name: 'German', code: 'DE', country: 'Germany' },
    { name: 'Chinese', code: 'CN', country: 'China' },
    { name: 'Japanese', code: 'JP', country: 'Japan' },
    { name: 'Korean', code: 'KR', country: 'South Korea' },
    { name: 'Italian', code: 'IT', country: 'Italy' },
    { name: 'Portuguese', code: 'PT', country: 'Portugal' },
    { name: 'Russian', code: 'RU', country: 'Russia' },
    { name: 'Arabic', code: 'SA', country: 'Saudi Arabia' },
    { name: 'Hindi', code: 'IN', country: 'India' },
    { name: 'Bengali', code: 'BD', country: 'Bangladesh' },
    { name: 'Urdu', code: 'PK', country: 'Pakistan' },
    { name: 'Turkish', code: 'TR', country: 'Turkey' },
    { name: 'Vietnamese', code: 'VN', country: 'Vietnam' },
    { name: 'Thai', code: 'TH', country: 'Thailand' },
    { name: 'Dutch', code: 'NL', country: 'Netherlands' },
    { name: 'Greek', code: 'GR', country: 'Greece' },
    { name: 'Swedish', code: 'SE', country: 'Sweden' },
    { name: 'Norwegian', code: 'NO', country: 'Norway' },
    { name: 'Danish', code: 'DK', country: 'Denmark' },
    { name: 'Finnish', code: 'FI', country: 'Finland' },
    { name: 'Polish', code: 'PL', country: 'Polland' },
    { name: 'Czech', code: 'CZ', country: 'Czech Republic' },
    { name: 'Hungarian', code: 'HU', country: 'Hungary' },
    { name: 'Romanian', code: 'RO', country: 'Romania' },
    { name: 'Hebrew', code: 'IL', country: 'Israel' },
    { name: 'Indonesian', code: 'ID', country: 'Indonesia' },
    { name: 'Malay', code: 'MY', country: 'Malaysia' },
    { name: 'Filipino', code: 'PH', country: 'Philippines' },
    { name: 'Swahili', code: 'KE', country: 'Kenya' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'My Account':
        return (
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4" style={{ width: '660px', height: '30px' }}>My Account</h3>

            <div className="p-4" style={{ width: '660px', height: '466.35px' }}>
              <div className="bg-gray-800 text-white p-4 rounded-t-lg mb-0" style={{ width: '660px', height: '100px' }}>
                <h3 className="text-xl font-semibold mb-2">Banner</h3>
              </div>
              <div className="bg-gray-8 00 text-white " style={{ width: '660px', height: '70px', padding: '16px 16px 0px 120px' }}>
                <h3 className="text-xl font-semibold mb-2">Additional Section</h3>
              </div>
              <div className="bg-gray-800 text-white" style={{ width: '628px', height: '263.95px', margin: '8px 16px 16px', padding: '16px' }}>
                <h3 className="text-xl font-semibold mb-2">Info</h3>
                <p>Display some information here.</p>
              </div>
            </div>
          </div>
        );
      case 'My Profile':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
            <p>Profile details go here...</p>
          </div>
        );
      case 'Devices':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Devices</h2>
            <p>Devices details go here...</p>
          </div>
        );
      case 'Connections':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Connections</h2>
            <p>Connections details go here...</p>
          </div>
        );
      case 'Appearance':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
            <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
              <p className="mb-2">This is an example of a chat in Dark Theme.</p>
              <div className="bg-gray-700 p-2 rounded-lg">
                <p>User1: Hello!</p>
                <p>User2: Hi there!</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Themes</h2>
            <div className="flex space-x-4 mb-4">
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${selectedTheme === 'White Theme' ? 'border-2 border-green-500' : 'border-2 border-gray-300'}`}
                onClick={() => setSelectedTheme('White Theme')}
              >
                <div className="w-12 h-12 bg-white rounded-full"></div>
                {selectedTheme === 'White Theme' && <FaCheck className="absolute text-green-500" />}
              </div>
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${selectedTheme === 'Dark Theme' ? 'border-2 border-green-500' : 'border-2 border-gray-300'}`}
                onClick={() => setSelectedTheme('Dark Theme')}
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                {selectedTheme === 'Dark Theme' && <FaCheck className="absolute text-green-500" />}
              </div>
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${selectedTheme === 'Default Theme' ? 'border-2 border-green-500' : 'border-2 border-gray-300'}`}
                onClick={() => setSelectedTheme('Default Theme')}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                {selectedTheme === 'Default Theme' && <FaCheck className="absolute text-green-500" />}
              </div>
            </div>
            <div className="flex space-x-4">
              <span className="text-center w-16">White</span>
              <span className="text-center w-16">Dark</span>
              <span className="text-center w-16">Default</span>
            </div>
          </div>
        );
      case 'Language':
        return (
          <div>
            <h5 className="text-xl font-semibold mb-2">Language</h5>
            <h1 className="text-2xl font-semibold mb-4">Select Your Language</h1>
            <div className="h-full overflow-y-scroll">
              {languages.map(language => (
                <div
                  key={language.name}
                  className={`flex items-center space-x-2 cursor-pointer p-2 ${selectedLanguage === language.name ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelectedLanguage(language.name)}
                >
                  <Flag code={language.code} className="w-6 h-4" />
                  <span>{language.name}</span>
                  <span className="text-gray-500">({language.country})</span>
                  {selectedLanguage === language.name && <FaCheck className="text-green-500" />}
                </div>
              ))}
            </div>
          </div>
        );
      case 'Notification':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notification</h2>
            <p>Notification settings go here...</p>
          </div>
        );
      default:
        return <div>Select a section from the left menu.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-800 via-gray-900 to black text-white">
      {/* Left Section */}
      <div className="bg-gray-900 text-white p-4 flex flex-col justify-between w-1/4">
        <div className="flex flex-col mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value="searchQuery"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pr-10 mb-4 border border-gray-600 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center mt-6">
            <span className="text-white font-bold text-sm">USER SETTINGS</span>
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <button onClick={() => setActiveSection('My Account')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'My Account' ? 'bg-gray-600' : ''}`}>My Account</button>
            <button onClick={() => setActiveSection('My Profile')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'My Profile' ? 'bg-gray-600' : ''}`}>My Profile</button>
            <button onClick={() => setActiveSection('Devices')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Devices' ? 'bg-gray-600' : ''}`}>Devices</button>
            <button onClick={() => setActiveSection('Connections')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Connections' ? 'bg-gray-600' : ''}`}>Connections</button>
          </div>
          <hr className="my-4 border-gray-600" />
          <div className="flex items-center mt-4">
            <span className="text-white font-bold text-sm">APP SETTINGS</span>
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <button onClick={() => setActiveSection('Appearance')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Appearance' ? 'bg-gray-600' : ''}`}>Appearance</button>
            <button onClick={() => setActiveSection('Language')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Language' ? 'bg-gray-600' : ''}`}>Language</button>
            <button onClick={() => setActiveSection('Notification')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Notification' ? 'bg-gray-600' : ''}`}>Notification</button>
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

      {/* Right Section */}
      <div className="flex-grow flex flex-col bg-gray-900 p-4 relative">
        <button
          onClick={handleBackClick}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200"
        >
          <FaTimes className="text-2xl" />
          <span className="mt-2">ESC</span>
        </button>
        <div className="mt-16 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
