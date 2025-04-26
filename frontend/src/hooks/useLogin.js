import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/auth/customer/login', { email, password });
      const data = response?.data;

      if (!data?.token || !data?.userId) {
        throw new Error('Invalid login response');
      }

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(data));

      // Update auth context
      dispatch({ type: 'LOGIN', payload: data });

      // Navigate to dashboard
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
