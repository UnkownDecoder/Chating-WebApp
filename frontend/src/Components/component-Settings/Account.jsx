import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const Account = () => {
  const [activeTab, setActiveTab] = useState('Security');

  // Dummy masked info (replace with your real data/masking logic)
  const displayName = '!! ViShAl $';
  const username = 'he/him';
  const maskedEmail = '***********@gmail.com';
  const maskedPhone = '*****8775';

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Account</h1>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex space-x-4 border-b border-gray-700">
        <button
          className={`pb-2 ${
            activeTab === 'Security'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400'
          }`}
          onClick={() => handleTabChange('Security')}
        >
          Security
        </button>
       
      </div>

      {/* User Info Card */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{displayName}</h2>
          <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Edit User Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Display Name */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-1">USERNAME</h3>
            <div className="flex items-center justify-between">
              <span>{displayName}</span>
              <button className="text-blue-400 hover:text-blue-200">Edit</button>
            </div>
          </div>

          {/* Username */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-1">PRONOUNCE</h3>
            <div className="flex items-center justify-between">
              <span>{username}</span>
              <button className="text-blue-400 hover:text-blue-200">Edit</button>
            </div>
          </div>

          {/* Email */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-1">EMAIL</h3>
            <div className="flex items-center justify-between">
              <span>{maskedEmail}</span>
              <button className="text-blue-400 hover:text-blue-200">Reveal</button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="bg-gray-700 p-4 rounded">
            <h3 className="font-semibold mb-1">PHONE NUMBER</h3>
            <div className="flex items-center justify-between">
              <span>{maskedPhone}</span>
              <button className="text-blue-400 hover:text-blue-200">Reveal</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button className="text-blue-400 hover:text-blue-200">Change Password</button>
          <button className="text-red-500 hover:text-red-300">Remove</button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Security' && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Security Settings</h3>
          <p className="text-sm text-gray-400">
            Here you can manage your security options (nickname,phone number, gmail,etc.).
          </p>
        </div>
      )}

      {activeTab === 'Standing' && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Account Standing</h3>
          <p className="text-sm text-gray-400">
            View your account reputation, warnings, or any restrictions here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Account;
