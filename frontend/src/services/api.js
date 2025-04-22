import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api/restaurant',
  timeout: 10000, // 🔥 Directly hit your Restaurant Service
});
