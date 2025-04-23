import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5003/api/restaurant',
  timeout: 10000, // 🔥 Directly hit your Restaurant Service
});
