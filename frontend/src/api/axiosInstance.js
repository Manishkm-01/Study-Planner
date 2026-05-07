import axios from 'axios';

const instance = axios.create({
  baseURL: '/', // Vite proxy will forward to backend
});

// Add request interceptor to attach JWT token if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
