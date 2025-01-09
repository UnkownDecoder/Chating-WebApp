import React, { useState } from "react";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState(""); // Email or phone
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateInput = () => {
    if (!identifier.trim()) {
      setError("Please enter your email or phone number.");
      return false;
    }
    if (!/^(\d{10}|\S+@\S+\.\S+)$/.test(identifier)) {
      setError("Enter a valid email address or 10-digit phone number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      try {
        const response = await fetch("http://localhost:5172/api/forget/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        });

        const result = await response.json();
        if (response.ok) {
          setSuccessMessage(`Password reset instructions sent to ${identifier}`);
        } else {
          setError(result.message || "Failed to send reset instructions");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred while requesting password reset.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium mb-1">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email or phone"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300"
          >
            Send Reset Instructions
          </button>
        </form>

        {successMessage && (
          <p className="text-green-500 text-center text-sm mt-4">{successMessage}</p>
        )}

        <p className="text-center text-gray-400 mt-4 text-sm">
          Remember your password? <a href="/login" className="text-blue-500 hover:underline hover:text-blue-300">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
