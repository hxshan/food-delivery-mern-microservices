import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, AlertCircle, Check, Shield } from 'lucide-react';
import axios from '../../api/axios';
import {ADMIN_URL} from '../../api/index';
import { useAuthContext } from '../../hooks/useAuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();
  
  const [adminData, setAdminData] = useState({
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

  // Check for notification from navigation state
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
    setAdminData(prev => ({
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
      const res = await axios.post(`${ADMIN_URL}/adminAuth/login`, adminData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const { token, admin } = res.data;
      
      // Create admin object with token
      const adminUser = {
        ...admin,
        token,
        isAdmin: true
      };

      console.log('Admin login successful:', adminUser);
      
      // Save admin data to local storage
      localStorage.setItem('admin', JSON.stringify(adminUser));
      
      // Update auth context with the correct action type
      dispatch({ type: 'ADMIN_LOGIN', payload: adminUser });
      
      // Show success notification
      showNotification('success', 'Login successful!');
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 1500);
      
    } catch (err) {
      console.error("Admin login error:", err);
      
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || 'Login failed';
      showNotification('error', errorMessage);
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
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="flex justify-center mb-6">
          <Shield size={40} className="text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Admin Portal</h1>
        <p className="text-gray-600 mb-6 text-center">Sign in to your admin account</p>
        
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
                value={adminData.email}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your admin email"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/admin/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center font-medium"
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
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-gray-700 text-center">
            This portal is restricted to authorized administrators only. 
            If you need access, please contact the system administrator.
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Not an admin? {' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Go to Customer Login</Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;