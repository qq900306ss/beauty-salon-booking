import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://f82cb2me3v.ap-northeast-1.awsapprunner.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token from NextAuth session (for client-side)
let getSessionToken = null;

export const setSessionTokenGetter = (getter) => {
  getSessionToken = getter;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Try to get token from NextAuth session first
    if (getSessionToken) {
      try {
        const token = await getSessionToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      } catch (error) {
        console.error('Failed to get session token:', error);
      }
    }

    // Fallback to localStorage (for backward compatibility)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://f82cb2me3v.ap-northeast-1.awsapprunner.com'}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
