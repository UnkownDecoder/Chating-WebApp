import React, { useState,useEffect } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';

const Account = () => {
  const [activeTab, setActiveTab] = useState('Security');
  const { authUser, updateProfile , changePassword } = useAuthStore();

  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');

const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

  const displayName = authUser?.username || 'Guest';
  const pronouns = authUser?.pronouns || 'he/him';
  const maskedEmail = showEmail ? authUser?.email : '*****@gmail.com';
  const maskedPhone = showPhone ? authUser?.phone : '*******';
console.log("authUser",authUser);



useEffect(() => {
  if (showPasswordModal) {
    setShowOldPassword(false);
    setShowNewPassword(false);
  }
}, [showPasswordModal]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const startEdit = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue);
  };

  const cancelEdit = () => {
    setEditField(null);
    setFieldValue('');
  };

  const saveEdit = async () => {
  if (!fieldValue) return;

  const updatedUserData = { ...authUser };

  switch (editField) {
    case 'username':
      updatedUserData.username = fieldValue;
      break;
    case 'pronouns':
      updatedUserData.pronouns = fieldValue;
      break;
    case 'email':
      updatedUserData.email = fieldValue;
      break;
    case 'phone':
      updatedUserData.phone = fieldValue;
      break;
    default:
      console.warn('Unknown edit field:', editField);
      break;
  }

  await updateProfile(updatedUserData);

  // 🔧 Placeholder for API call
  console.log('Saving user data:', updatedUserData);

  // Reset editing state
  setEditField(null);
  setFieldValue('');
};


const handlePasswordChange = async () => {
  if (!oldPassword || !newPassword) {
    alert('Both fields are required.');
    return;
  }

  try {
    await changePassword(oldPassword, newPassword);
    alert('Password updated successfully.');
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
  } catch (err) {
    console.error('Password change failed:', err);
    alert(err.message || 'Something went wrong. Please try again.');
  }
};


  return (
    <>
      {/* Edit Modal */}
      {editField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit {editField}</h3>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>

           
              <input
                type={editField === 'email' ? 'email' : 'text'}
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded mb-4"
              />
            

            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Account</h3>
            <p className="mb-6">
              Are you sure you want to permanently delete your account? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => console.log('Account deletion requested')}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Section */}
      <div className="min-h-screen bg-gray-900 text-white p-6">
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
          <button
            className={`pb-2 ${
              activeTab === 'Standing'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400'
            }`}
            onClick={() => handleTabChange('Standing')}
          >
            Standing
          </button>
        </div>

        {/* User Info */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{displayName}</h2>
            <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
              Edit User Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Username */}
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-1">USERNAME</h3>
              <div className="flex items-center justify-between">
                <span>{displayName}</span>
                <button
                  onClick={() => startEdit('username', displayName)}
                  className="text-blue-400 hover:text-blue-200"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Pronouns */}
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-1">PRONOUNS</h3>
              <div className="flex items-center justify-between">
                <span>{pronouns}</span>
                <button
                  onClick={() => startEdit('pronouns', pronouns)}
                  className="text-blue-400 hover:text-blue-200"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-1">EMAIL</h3>
              <div className="flex items-center justify-between">
                <span>{maskedEmail}</span>
                <button
                  onClick={() =>
                    showEmail ? startEdit('email', authUser?.email) : setShowEmail(true)
                  }
                  className="text-blue-400 hover:text-blue-200"
                >
                  {showEmail ? 'Edit' : 'Reveal'}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-1">PHONE NUMBER</h3>
              <div className="flex items-center justify-between">
                <span>{maskedPhone}</span>
                <button
                  onClick={() =>
                    showPhone ? startEdit('phone', authUser?.phone) : setShowPhone(true)
                  }
                  className="text-blue-400 hover:text-blue-200"
                >
                  {showPhone ? 'Edit' : 'Reveal'}
                </button>
              </div>
            </div>
          </div>

 {/* Change Password poppup */}
 {showPasswordModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Change Password</h3>
        <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
          <FaTimes />
        </button>
      </div>

      {/* Old Password */}
      <div className="relative mb-4">
        <input
          type={showOldPassword ? "text" : "password"}
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded pr-10"
        />
        <span
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400"
          onClick={() => setShowOldPassword(!showOldPassword)}
        >
          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* New Password */}
      <div className="relative mb-4">
        <input
          type={showNewPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded pr-10"
        />
        <span
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowPasswordModal(false)}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

          {/* Change Password and Remove Account Buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-400 hover:text-blue-200"
            >
              Change Password
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-300"
            >
              Remove Account
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Security' && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <p className="text-sm text-gray-400">
              Here you can manage your security options (nickname, phone number, email, etc.).
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
    </>
  );
};

export default Account;
