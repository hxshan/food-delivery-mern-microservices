import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Check } from "lucide-react";
import axios from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const res = await axios.post("/auth/customer/signup", userData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
  
      const { message, userId } = res.data;
      
      if (userId) {
        // Determine the appropriate notification message based on response
        let notificationMsg;
        
        if (message?.toLowerCase().includes("verification code has been resent")) {
          notificationMsg = "Verification code has been resent to your email!";
        } else if (message?.toLowerCase().includes("role added to your account")) {
          notificationMsg = "Role added successfully! Please verify your email.";
        } else {
          notificationMsg = "Registration successful! OTP has been sent to your email.";
        }
        
        showNotification("success", notificationMsg);
        
        // Always redirect to OTP verification when userId is present
        setTimeout(() => {
          navigate(`/verify-otp/${userId}`, { replace: true });
        }, 2000);
      } else {
        // For any success response without userId (shouldn't happen with our updated backend)
        showNotification("success", message || "Operation successful!");
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || "Signup failed";
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Notification popup */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 flex items-center ${
            notification.type === "success" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          <div className={`p-2 rounded-full mr-3 ${notification.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {notification.type === "success" ? (
              <Check size={20} className="text-green-500" />
            ) : (
              <span className="text-red-500 font-bold">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${notification.type === "success" ? "text-green-800" : "text-red-800"}`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-red-500 transition duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 flex items-center justify-center font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                <span>Signing Up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;