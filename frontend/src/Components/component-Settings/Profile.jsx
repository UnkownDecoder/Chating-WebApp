import React, { useState } from "react";
import { MdPhotoCamera } from "react-icons/md";
import { useAuthStore } from '../../store/useAuthStore';
const Profile = () => {

  const { authUser , updateProfile } = useAuthStore();
  // Default values (adjust as desired)
  const [displayName, setDisplayName] = useState( authUser?.username );
  const [pronouns, setPronouns] = useState(authUser?.pronouns);
  const [avatarFile, setAvatarFile] = useState(null);
  // Remove bannerColor and use bannerFile for banner image
  const [bannerFile, setBannerFile] = useState(null);
  const [aboutMe, setAboutMe] = useState(authUser?.bio || "");
  
  // Handlers for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
  };

  // Handlers for banner image
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
    }
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
  };

  // Handler for save button
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', displayName);
      formData.append('pronouns', pronouns);
      formData.append('bio', aboutMe);
      
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }
      if (bannerFile) {
        formData.append('bannerImage', bannerFile);
      }

      // Call updateProfile with FormData
      await updateProfile(formData);
      // alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        
        {/* Left Side: Form Fields */}
        <div className="md:w-2/3 bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
          
          {/* DISPLAY NAME */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">DISPLAY NAME</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          {/* PRONOUNS */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">PRONOUNS</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            />
          </div>
          
          {/* AVATAR */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">AVATAR</label>
            <div className="flex items-center space-x-4">
              {/* Change Avatar */}
              <label className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md cursor-pointer">
                <span>Change Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              
              {/* Remove Avatar */}
              <button
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                onClick={handleRemoveAvatar}
              >
                Remove Avatar
              </button>
            </div>
          </div>
          
          {/* BANNER */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">BANNER</label>
            <div className="flex items-center space-x-4">
              {/* Change Banner */}
              <label className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md cursor-pointer">
                <span>Change Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </label>
              {/* Remove Banner */}
              <button
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
                onClick={handleRemoveBanner}
              >
                Remove Banner
              </button>
            </div>
          </div>
          
          {/* ABOUT ME */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1">ABOUT ME</label>
            <textarea
              rows="4"
              className="w-full p-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder='You can use markdown and links if you’d like.'
            />
          </div>
          
          {/* Save Button */}
          <div className="mt-6">
            <button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-bold"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
        
        {/* Right Side: Preview */}
        <div className="md:w-1/3 bg-gray-900 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">PREVIEW</h3>
          
          {/* Banner area */}
          <div className="w-full h-20 mb-6 rounded-md relative">
            {bannerFile ? (
              <img
                src={URL.createObjectURL(bannerFile)}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <img
                src={authUser?.bannerImage || "default-image-url"}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-md"
              />
            )}
            {/* Avatar preview */}
            <div className="absolute -bottom-8 left-4 flex items-center">
              <div className="w-16 h-16 rounded-full border-4 border-gray-900 bg-gray-700 overflow-hidden">
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={authUser?.profileImage || "default-image-url"}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Name & Pronouns */}
          <div className="mt-10 text-left">
            <p className="text-lg font-semibold">{displayName}</p>
            <p className="text-gray-400">{pronouns}</p>
          </div>
          
          {/* About Me Preview */}
          <div className="mt-4 bg-gray-800 p-3 rounded-md">
            <p className="text-gray-300 whitespace-pre-line">
              {aboutMe || "No about me yet..."}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
