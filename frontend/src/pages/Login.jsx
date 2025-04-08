import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import { get } from "mongoose";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });


 
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim())
      newErrors.identifier = "Email or phone number is required.";
    if (
      !/^\d{10}$/.test(formData.identifier) &&
      !/\S+@\S+\.\S+/.test(formData.identifier)
    )
      newErrors.identifier = "Enter a valid email address or 10-digit phone number.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Check if the credentials match the admin credentials
        if (formData.identifier === 'lionjumama669@gmail.com' && formData.password === '246810') {
          setErrorMessage("Login successful!");
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
            navigate('/admin');
          }, 3000);
        } else {
          const response = await login(formData);
          console.log("respo",response);
          if (response?.success) {
            setErrorMessage("Login successful!");
            setShowMessage(true);
            setTimeout(() => {
              setShowMessage(false);
              navigate("/chat");
            }, 3000);
          } else {
            setErrorMessage(response?.message || "Invalid credentials");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Invalid candidate");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </a>
        </div>

        {/* Error Message */}
        {showMessage && (
          <div className={`mt-4 p-2 rounded-lg text-center ${errorMessage === "Login successful!" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {errorMessage}
          </div>
        )}

        {/* Redirect to Register */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Haven't registered?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;