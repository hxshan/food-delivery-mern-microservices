import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Check, AlertTriangle } from "lucide-react";
import axios from "../api/axios";
import { useAuthContext } from "../hooks/useAuthContext";

const DriverLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();

  const [credentials, setCredentials] = useState({
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

  // Check for notification from navigation state (for redirects from verification)
  useEffect(() => {
    if (location.state?.notification) {
      setNotification({
        show: true,
        type: location.state.notification.type,
        message: location.state.notification.message
      });
      
      // Clear the state to prevent showing the notification again on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 5000);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
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
      const res = await axios.post("/auth/driver/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      const userData = res.data;
      
      // Specifically check for pending driver status
      if (userData.roleStatus && userData.roleStatus.driver === "pending") {
        showNotification("warning", "Your driver account is pending approval. We'll notify you once approved.");
        setLoading(false);
        navigate('/driver/inactive');
        return;
      }
      
      // Check overall account status
      if (userData.status === "suspended" || userData.status === "banned") {
        showNotification("error", `Your account is ${userData.status}. Please contact support.`);
        setLoading(false);
        return;
      }

      // Save user data to local storage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Update auth context
      dispatch({ type: "LOGIN", payload: userData });

      // Show success notification
      showNotification("success", "Login successful! Redirecting to dashboard...");
      
      // Redirect to driver dashboard
      setTimeout(() => {
        navigate("/driver/dashboard", { replace: true });
      }, 1500);
      
    } catch (err) {
      console.error(err);
      
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || "Login failed";
      
      // Handle specific error cases
      if (errorMessage.includes("pending approval")) {
        showNotification("warning", "Your driver account is pending approval. We'll notify you once approved.");
      } else if (errorMessage.includes("not registered as a driver")) {
        showNotification("error", "You are not registered as a driver. Please sign up first.");
      } else if (errorMessage.includes("Email not verified")) {
        showNotification("warning", "Please verify your email before logging in.");
        
        // If userId is included in the response, we can redirect to verification
        if (err?.response?.data?.userId) {
          setTimeout(() => {
            navigate(`/verify-otp/${err.response.data.userId}`, { replace: true });
          }, 2000);
        }
      } else {
        showNotification("error", errorMessage);
      }
      
      setError(errorMessage);
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
            notification.type === "success" ? "bg-green-50 border-l-4 border-green-500" : 
            notification.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-500" :
            "bg-red-50 border-l-4 border-red-500"
          }`}
        >
          <div className={`p-2 rounded-full mr-3 ${
            notification.type === "success" ? "bg-green-100" : 
            notification.type === "warning" ? "bg-yellow-100" :
            "bg-red-100"
          }`}>
            {notification.type === "success" ? (
              <Check size={20} className="text-green-500" />
            ) : notification.type === "warning" ? (
              <AlertTriangle size={20} className="text-yellow-500" />
            ) : (
              <span className="text-red-500 font-bold">!</span>
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${
              notification.type === "success" ? "text-green-800" : 
              notification.type === "warning" ? "text-yellow-800" :
              "text-red-800"
            }`}>
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
          Driver Login
        </h1>

        {error && !notification.show && (
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
                value={credentials.email}
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
                value={credentials.password}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
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
                <span>Logging In...</span>
              </>
            ) : (
              "Log In as Driver"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/driverSignup" className="text-red-500 hover:underline font-medium">
              Sign Up as Driver
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-red-500">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;