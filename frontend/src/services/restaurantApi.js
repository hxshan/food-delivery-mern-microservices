import axios from 'axios';

export const restaurantApi = axios.create({
  baseURL: 'http://localhost:5003/api/restaurant',
  timeout: 20000, 
});

restaurantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);