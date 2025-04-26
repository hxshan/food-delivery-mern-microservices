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

      if (!data?.userId) {
        throw new Error('Invalid verification response');
      }

      // Check role status for driver
      const driverStatus = data?.roleStatus?.driver || "pending";
      
      // For drivers, we don't store the token or log them in automatically
      // We just show a message that their account is pending approval
      if (driverStatus === "pending") {
        // Navigate to a waiting page or login page with a message
        navigate('/driverLogin', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Your email has been verified! Your driver account is now pending approval. We will notify you once approved.'
            }
          }
        });
      } else {
        // This case is unlikely to happen for new drivers, but handling it just in case
        navigate('/driverLogin', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Your email has been verified! You can now log in to your driver account.'
            }
          }
        });
      }

      return { 
        success: true, 
        message: 'Email verification successful!', 
        status: driverStatus 
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