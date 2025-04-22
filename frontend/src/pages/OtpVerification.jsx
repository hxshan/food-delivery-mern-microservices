import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VerificationSuccessPopup from '../components/VerificationSuccessPopup';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if OTP is completed
    if (otp.join('').length === 6) {
      // Show success popup
      setShowSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/signup" className="flex items-center text-gray-600 hover:text-red-500">
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Sign Up</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">Enter the 6-digit code we sent to your email</p>
          
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ))}
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200"
            >
              Verify
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the code? {' '}
              <button className="text-red-500 hover:underline">Resend</button>
            </p>
          </div>
        </div>
      </div>
      
      {showSuccess && <VerificationSuccessPopup />}
    </div>
  );
};

export default OtpVerification;