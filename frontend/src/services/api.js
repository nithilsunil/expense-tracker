import axios from 'axios';

// Locate endpoint URL, fallback to local development port if variable is not configured
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT token into header requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept expired token/unauthorized responses to trigger logouts automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage session parameters
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optionally trigger reload to route user to login automatically
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
