import React, { useState, useEffect } from 'react';
import { FaSearch, FaSignOutAlt, FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();
  const { logout, authUser, updateProfile, setAuthUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState('My Account');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Default Theme');
  const [profilePhoto, setProfilePhoto] = useState(authUser?.profileImage || '');
  const [name, setName] = useState(authUser?.name || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(authUser?.phoneNumber || '');
  const [theme, setTheme] = useState('dark'); // State to manage the current theme

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Apply the theme to the application
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5172/api/user/${userId}`);
      const userData = response.data;

      setName(userData.name);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
      setProfilePhoto(userData.profileImage);
      setAuthUser(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ profileImage: profilePhoto, name, bio });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Profile update failed');
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.slice(0, Math.ceil(user.length / 2)) + '*'.repeat(Math.floor(user.length / 2));
    return `${maskedUser}@${domain}`;
  };

  const maskPhoneNumber = (phoneNumber) => {
    return phoneNumber.slice(0, Math.ceil(phoneNumber.length / 2)) + '*'.repeat(Math.floor(phoneNumber.length / 2));
  };

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
              <div className="bg-gray-800 text-white " style={{ width: '660px', height: '70px', padding: '16px 16px 0px 120px' }}>
                <h3 className="text-xl font-semibold mb-2">Additional Section</h3>
              </div>
              <div className="bg-gray-800 text-white" style={{ width: '628px', height: '263.95px', margin: '8px 16px 16px', padding: '16px' }}>
                <h3 className="text-xl font-semibold mb-2">Info</h3>
                <p>{name || 'No name available'}</p>
                <p>{email ? maskEmail(email) : 'No email available'}</p>
                <p>{phoneNumber ? maskPhoneNumber(phoneNumber) : 'No phone number available'}</p>
              </div>
            </div>
          </div>
        );
      case 'My Profile':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {profilePhoto && <img src={profilePhoto} alt="Profile" className="mt-2 w-32 h-32 rounded-full" />}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Update Profile
              </button>
            </form>
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
                onClick={() => {
                  setSelectedTheme('White Theme');
                  setTheme('light');
                }}
              >
                <div className="w-12 h-12 bg-white rounded-full"></div>
                {selectedTheme === 'White Theme' && <FaCheck className="absolute text-green-500" />}
              </div>
              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${selectedTheme === 'Dark Theme' ? 'border-2 border-green-500' : 'border-2 border-gray-300'}`}
                onClick={() => {
                  setSelectedTheme('Dark Theme');
                  setTheme('dark');
                }}
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
              value={searchQuery}
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
          </div>
          <hr className="my-4 border-gray-600" />
          <div className="flex items-center mt-4">
            <span className="text-white font-bold text-sm">APP SETTINGS</span>
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <button onClick={() => setActiveSection('Appearance')} className={`bg-transparent text-left text-white py-2 px-4 rounded-lg hover:bg-gray-600 ${activeSection === 'Appearance' ? 'bg-gray-600' : ''}`}>Appearance</button>
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