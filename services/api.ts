// Axios API client configuration
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config } from '../constants/config';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting auth token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(
            `${Config.API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Store new tokens
          await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
          await SecureStore.setItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN);
        // The app should handle this redirect based on auth state
      }
    }
    
    // Format error message
    const errorMessage = getErrorMessage(error as AxiosError<{ message?: string }>);
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to extract error message
function getErrorMessage(error: AxiosError<{ message?: string }>): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
  
  if (error.message === 'Network Error') {
    return 'No internet connection. Please check your network.';
  }
  
  return 'An unexpected error occurred.';
}

export default api;
