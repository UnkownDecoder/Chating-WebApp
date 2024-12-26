import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for eye toggle
import { MdPhotoCamera } from "react-icons/md"; // Icon for camera

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    phone: "",
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [profileImage, setProfileImage] = useState(null); // For uploaded profile picture
  const [bannerImage, setBannerImage] = useState(null); // For uploaded banner image

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      if (type === "profile") setProfileImage(imageUrl);
      if (type === "banner") setBannerImage(imageUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!formData.birthdate)
      newErrors.birthdate = "Please select your birthdate.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission logic
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-8">
        {/* Banner Section */}
        <div className="relative mb-6">
          <input
            type="file"
            accept="image/*"
            id="bannerImage"
            className="hidden"
            onChange={(e) => handleFileChange(e, "banner")}
          />
          <label htmlFor="bannerImage">
            <div className="w-full h-32 bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <MdPhotoCamera className="text-4xl text-gray-400" />
              )}
            </div>
          </label>
          <p className="text-gray-400 text-sm text-center mt-2">
            Upload a banner image
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              id="profileImage"
              className="hidden"
              onChange={(e) => handleFileChange(e, "profile")}
            />
            <label htmlFor="profileImage">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <MdPhotoCamera className="text-4xl text-gray-400" />
                )}
              </div>
            </label>
          </div>
          <p className="text-gray-400 text-sm mt-2">Upload your profile photo</p>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center glow-effect">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Birthdate */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium mb-1">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="4"
              placeholder="Write something about yourself..."
            ></textarea>
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline hover:text-blue-300"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

