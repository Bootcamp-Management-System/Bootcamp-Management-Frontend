import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup') || requestUrl.includes('/auth/verify-otp') || requestUrl.includes('/auth/forgot-password') || requestUrl.includes('/auth/reset-password');
      const token = localStorage.getItem('auth_token');

      // Keep demo sessions stable even if backend rejects the token.
      if (token && token.startsWith('demo_token_')) {
        return Promise.reject(error);
      }

      if (isAuthRoute || error.config?.skipAuthRedirect) {
        return Promise.reject(error);
      }

      console.warn('Session invalid or expired.');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
