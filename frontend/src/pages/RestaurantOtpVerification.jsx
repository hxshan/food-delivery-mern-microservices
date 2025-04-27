import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOTPRestaurant } from '../hooks/useOTPRestaurant';
import axios from '../api/axios';

const RestaurantOtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });
  const [userEmail, setUserEmail] = useState('');

  const { verifyOtp, isLoading, error } = useOTPRestaurant();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);
  const formRef = useRef(null);

  // Focus first input and setup paste event
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Add paste event listener to the form container
    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').trim();
      
      // Check if pasted content is a 6-digit number
      if (/^\d{6}$/.test(pastedData)) {
        const newOtp = pastedData.split('');
        setOtp(newOtp);
        // Focus the last input after paste
        inputRefs.current[5].focus();
      }
    };
    
    if (formRef.current) {
      formRef.current.addEventListener('paste', handlePaste);
    }
    
    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  // Display any errors from the hook
  useEffect(() => {
    if (error) {
      showNotification('error', error);
    }
  }, [error]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if the current one is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto-submit if all digits are filled
    if (value !== '' && index === 5 && newOtp.every(digit => digit !== '')) {
      setTimeout(() => handleSubmit(null), 300);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
  
    // Check if OTP is completed
    if (otp.join('').length === 6) {
      const result = await verifyOtp(userId, otp.join(''));
      
      if (result.success) {
        showNotification('success', result.message);
        
        
        setTimeout(() => {
          navigate('/add-restaurant', { 
            state: { 
              notification: {
                type: 'success',
                message: 'Your email has been verified! Your restaurant account is now pending approval. We will notify you once approved.'
              }
            }
          });
        }, 3000);
      } else {
        showNotification('error', result.message);
      }
    } else {
      showNotification('error', 'Please enter all 6 digits of the OTP.');
    }
  };

  const handleResendOtp = async () => {
    if (!userId) {
      showNotification('error', 'User information is missing. Please go back to signup.');
      return;
    }
    
    try {
      setResendLoading(true);
      await axios.post('/auth/restaurant/resend-otp', { 
        userId: userId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      // Show success notification
      showNotification('success', 'A new OTP has been sent to your email!');
      
      // Clear the current OTP fields
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      showNotification('error', error?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
              <AlertCircle size={20} className="text-red-500" />
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
          <Link to="/restaurantSignup" className="flex items-center text-gray-600 hover:text-red-500 transition duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Restaurant Sign Up</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Verify Your Email</h1>
        <p className="text-gray-600 mb-2 text-center">Enter the 6-digit code we sent to your email</p>
        
        {userEmail && (
          <p className="text-gray-700 font-medium mb-6 text-center">{userEmail}</p>
        )}
        
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          <p className="text-sm">You can paste your 6-digit code directly into the form</p>
        </div>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                disabled={isLoading || resendLoading}
              />
            ))}
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200 flex items-center justify-center font-medium"
            disabled={isLoading || resendLoading || otp.join('').length !== 6}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                <span>Verifying...</span>
              </>
            ) : (
              "Verify"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button 
              className="text-red-500 hover:underline font-medium" 
              onClick={handleResendOtp}
              disabled={isLoading || resendLoading}
            >
              {resendLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-1"></span>
                  <span>Sending...</span>
                </>
              ) : (
                'Resend'
              )}
            </button>
          </p>
        </div>
        
        {/* Restaurant-specific information */}
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded">
          <p className="text-sm font-medium">
            After verification, your restaurant account will need to be approved by an administrator before you can login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOtpVerification;