import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import SettingsSidebar from './SettingSidebar';
import Appearance from '../Components/component-Settings/Appearance'; 
import Account from '../Components/component-Settings/Account'; 
import Profile from '../Components/component-Settings/Profile'; // NEW: Import the Profile component

const Settings = () => {
  const navigate = useNavigate();
  const { logout, authUser, updateProfile, } = useAuthStore();
  const [activeSection, setActiveSection] = useState('My Account');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Default Theme');
  const [profilePhoto, setProfilePhoto] = useState(authUser?.profileImage || '');
  const [name, setName] = useState(authUser?.name || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(authUser?.phoneNumber || '');
  const [theme, setTheme] = useState('dark');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
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
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleBackClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarVisible(true);
    } else {
      window.history.back();
    }
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

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'My Account':
        return <Account />;
      case 'My Profile':
        return <Profile />; // NEW: Render Profile.jsx when My Profile is selected
      case 'Appearance':
        return <Appearance />;
      default:
        return <div>Select a section from the left menu.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
      {isSidebarVisible && (
        <SettingsSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleLogoutClick={handleLogoutClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsSidebarVisible={setIsSidebarVisible}
        />
      )}
      {/* Right Section */}
      <div className={`flex-grow flex flex-col bg-gray-900 p-4 relative ${isSidebarVisible ? 'hidden md:flex' : 'flex'}`}>
        <button
          onClick={handleBackClick}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200"
        >
          <span className="hidden md:inline">
            <FaTimes className="text-2xl" />
            <span className="mt-2">ESC</span>
          </span>
          <span className="md:hidden">
            <FaArrowLeft className="text-2xl" />
            <span className="mt-2">Back</span>
          </span>
        </button>
        <div className="mt-16 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
