import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility toggle
import { useNavigate } from "react-router-dom"; // For navigation

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // For email or phone
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // For controlling message visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim())
      newErrors.identifier = "Email or phone number is required.";
    if (
      !/^\d{10}$/.test(formData.identifier) &&
      !/\S+@\S+\.\S+/.test(formData.identifier)
    )
      newErrors.identifier =
        "Enter a valid email address or 10-digit phone number.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      try {
        const response = await fetch("http://localhost:5172/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("response ", result);
          setErrorMessage(`Welcome, ${result.user.username || "User"}!`);
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
            // Pass username and profileImage as state to the /chat route
            navigate("/chat", {
              state: {
                username: result.user.username,
                profileImage: result.user.profileImage || "default-image-url", // Default image if not present
              },
            });
          }, 3000); // Show message for 3 seconds
        } else {
          setErrorMessage(result.message || "Login failed");
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000); // Show message for 3 seconds
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Login failed");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Show message for 3 seconds
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center glow-effect">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Phone */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium mb-1">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email or phone"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
            )}
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
              placeholder="Enter your password"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-blue-500 hover:underline hover:text-blue-300 text-sm"
          >
            Forgot Password?
          </a>
        </div>

        {/* Error Message */}
        {showMessage && (
          <div className="dropdown-message">
            {errorMessage}
          </div>
        )}

        {/* Redirect to Register */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Haven't registered?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline hover:text-blue-300"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;