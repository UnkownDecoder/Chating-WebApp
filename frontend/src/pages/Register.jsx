import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for eye toggle
import { MdPhotoCamera } from "react-icons/md"; // Icon for camera
import { FaTrash } from "react-icons/fa"; // Icon for remove button

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

  const [alertmessage, setAlertMessage] = useState(""); 
  const navigate = useNavigate(); // For navigation
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [profileImage, setProfileImage] = useState(null); // For uploaded profile picture
  const [bannerImage, setBannerImage] = useState(null); // For uploaded banner image
  const [loading, setLoading] = useState(false); // For showing loader
  const [successMessage, setSuccessMessage] = useState(""); // For success message

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Size in MB
      const fileType = file.type.split("/")[0];
      if (fileType !== "image" || fileSize > 5) {
        alert("Please upload a valid image (max size 5MB).");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (type === "profile") setProfileImage(imageUrl);
      if (type === "banner") setBannerImage(imageUrl);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === "profile") setProfileImage(null);
    if (type === "banner") setBannerImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (
      !/^\d{10}$/.test(formData.phone) &&
      !/^\+?\d{1,4}[-\s]?\(?\d{1,4}?\)?[-\s]?\d{1,4}[-\s]?\d{1,4}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!formData.birthdate) newErrors.birthdate = "Please select your birthdate.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Show loader
      // Simulate form submission (e.g., API call)
      setTimeout(() => {
        setLoading(false); // Hide loader after 2 seconds
        setSuccessMessage("Registration successful!"); // Show success message

        // Clear form data and images
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          birthdate: "",
          phone: "",
          bio: "",
        });
        setProfileImage(null); // Reset profile image
        setBannerImage(null); // Reset banner image
        navigate("/login"); // Redirect to login page
        setAlertMessage("Registration successful!");
      }, 2000); // Simulate API delay (2 seconds)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-4xl flex space-x-8">
        {/* Left Section: Registration Form */}
        <div className="w-1/2 bg-gray-900 text-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center glow-effect">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={(e) => handleFileChange(e, "profile")}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("profile")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            {/* Banner Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="bannerImage" className="block text-sm font-medium mb-1">
                  Banner Image
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  name="bannerImage"
                  onChange={(e) => handleFileChange(e, "banner")}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              {bannerImage && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage("banner")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>

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
                max={today} // Restrict the date to today's date
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
                maxLength="300"
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
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 text-center text-green-500 font-semibold">
              {successMessage}
            </div>
          )}
        </div>

        {/* Right Section: Preview */}
        <div className="w-[300px] h-[340.85px] bg-gray-800 text-white rounded-lg shadow-lg ">
          <div className="relative flex flex-col items-center space-y-4">
            {/* Header Div with Banner Image */}
            <div className="w-[300px] h-[150px] bg-gray-700 rounded-lg">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <MdPhotoCamera className="text-4xl text-gray-400 absolute inset-0 m-auto" />
              )}
            </div>

            {/* Profile Image */}
            <div className="absolute left-4 top-20">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-900">
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
            </div>

            {/* Preview Details */}
            <div className="w-[300px] h-[126.85px] p-4">
              <div className="w-[268px] h-[24px] bg-transparent rounded-lg mb-4 flex items-center justify-start">
                <h3 className="text-xl font-semibold">{formData.username || "Username"}</h3>
              </div>
              <div className="w-[268px] h-[55.25px] bg-transparent rounded-lg mb-4 flex items-start justify-start">
                <p className="text-sm text-gray-400">{formData.bio || "Bio not provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;








