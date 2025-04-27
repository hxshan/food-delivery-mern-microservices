import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import axios from '../api/axios';
import { useAuthContext } from '../hooks/useAuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();
  
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
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
    setUserData(prev => ({
      ...prev,
      [name]: value
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
    setError('');
    
    try {
      const res = await axios.post('/auth/customer/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const user = res.data;
      
      // Check if user is a customer
      if (!user.roles.includes('customer')) {
        showNotification('error', 'This account is not registered as a customer. Please use the appropriate login page.');
        setLoading(false);
        return;
      }
      
      // Check account status
      if (user.status === 'suspended' || user.status === 'banned') {
        showNotification('error', `Your account is ${user.status}. Please contact support.`);
        setLoading(false);
        return;
      }

      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth context
      dispatch({ type: 'LOGIN', payload: user });
      
      // Show success notification
      showNotification('success', 'Login successful!');
      
      // Redirect to customer dashboard/home
      setTimeout(() => {
        navigate('/customer/dashboard', { replace: true });
      }, 1500);
      
    } catch (err) {
      console.error("Login error:", err);
      
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || 'Login failed';
      
      // Handle specific error cases
      if (errorMessage.includes('Email not verified')) {
        showNotification('warning', 'Please verify your email before logging in.');
        
        // If userId is included in the response, we can redirect to verification
        if (err?.response?.data?.userId) {
          setTimeout(() => {
            navigate(`/verify-otp/${err.response.data.userId}`, { replace: true });
          }, 2000);
        }
      } else {
        showNotification('error', errorMessage);
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
              <AlertCircle size={20} className="text-yellow-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
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
          <Link to="/" className="flex items-center text-gray-600 hover:text-red-500 transition duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome back</h1>
        <p className="text-gray-600 mb-6 text-center">Sign in to your customer account</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-red-500 hover:underline">Forgot password?</Link>
            </div>
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
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-red-500 focus:ring-red-400 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 flex items-center justify-center font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? {' '}
            <Link to="/signup" className="text-red-500 hover:underline font-medium">Sign Up</Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Restaurant owner? {' '}
            <Link to="/restaurantLogin" className="text-red-500 hover:underline font-medium">Sign in as Restaurant</Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.081z" />
              </svg>
            </button>
            
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;