import axios from 'axios';

export const restaurantApi = axios.create({
  baseURL: 'http://localhost:3001/api/restaurant',
  timeout: 10000, 
});
