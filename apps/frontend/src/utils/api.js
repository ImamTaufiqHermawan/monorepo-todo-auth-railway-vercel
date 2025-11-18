import axios from 'axios';
import { getToken, removeToken } from './auth';

// Ambil URL backend dari environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Buat instance axios dengan base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk request: tambahkan JWT token ke Authorization header
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk response: handle error 401 (Unauthorized)
// Jika token expired atau invalid, redirect ke halaman login
// Kecuali jika sedang di halaman login atau endpoint login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Jangan redirect jika sedang di halaman login atau request ke endpoint login
      const isLoginPage = window.location.pathname === '/login';
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        removeToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

