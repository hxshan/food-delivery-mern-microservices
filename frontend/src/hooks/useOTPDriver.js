import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const useOTPDriver = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const verifyOtp = async (userId, otp) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/auth/driver/verify-otp', {
        userId,
        otp
      });
      
      const data = response?.data;
      console.log(response)

      if (!data?.userId) {
        throw new Error('Invalid verification response');
      }

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(data));

      // Update auth context
      dispatch({ type: 'LOGIN', payload: data });

      navigate('/driver-details', { 
        state: { 
          notification: {
            type: 'success',
            message: 'Your email has been verified!'
          }
        }
      });

      return { 
        success: true, 
        message: 'Email verification successful!'
      };

    } catch (error) {
      console.error('Verification error:', error);
      
      const errorData = error?.response?.data;
      const errorMessage = errorData?.message || 'Verification failed';
      const errorStatus = errorData?.status;
      
      let message = errorMessage;
      
      // Format specific error messages
      if (errorStatus === 'EXPIRED') {
        message = 'Your OTP has expired or is invalid. Please request a new one.';
      } else if (errorStatus === 'INVALID') {
        message = 'Invalid OTP. Please check and try again.';
      }
      
      setError(message);
      return { success: false, message, status: errorStatus };
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyOtp, isLoading, error };
};