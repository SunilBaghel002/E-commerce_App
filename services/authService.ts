// Authentication service with mock data support
import api from './api';
import * as SecureStore from 'expo-secure-store';
import { Config, Endpoints } from '../constants';
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const USE_MOCK = true; // Set to false when backend is ready

export const authService = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const token = 'mock_jwt_token_' + Date.now();
        await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
        return { user: mockUser, token };
      }
      throw new Error('Invalid email or password');
    }

    const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>(
      Endpoints.LOGIN,
      credentials
    );
    
    const { user, token, refreshToken } = response.data.data;
    
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    return { user, token };
  },

  // Register new user
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...mockUser,
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };
      
      const token = 'mock_jwt_token_' + Date.now();
      await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
      return { user: newUser, token };
    }

    const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>(
      Endpoints.REGISTER,
      data
    );
    
    const { user, token, refreshToken } = response.data.data;
    
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    return { user, token };
  },

  // Logout
  async logout(): Promise<void> {
    if (!USE_MOCK) {
      try {
        await api.post(Endpoints.LOGOUT);
      } catch (error) {
        console.log('Logout API error:', error);
      }
    }
    
    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Request password reset
  async forgotPassword(email: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await api.post(Endpoints.FORGOT_PASSWORD, { email });
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await api.post(Endpoints.RESET_PASSWORD, { token, newPassword });
  },

  // Social login
  async socialLogin(provider: 'google' | 'apple', accessToken: string): Promise<{ user: User; token: string }> {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = 'mock_jwt_token_' + Date.now();
      await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
      return { user: mockUser, token };
    }

    const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>(
      Endpoints.SOCIAL_LOGIN,
      { provider, accessToken }
    );
    
    const { user, token, refreshToken } = response.data.data;
    
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    return { user, token };
  },

  // Get current user from stored token
  async getCurrentUser(): Promise<User | null> {
    const token = await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
    
    if (!token) {
      return null;
    }

    if (USE_MOCK) {
      return mockUser;
    }

    try {
      const response = await api.get<ApiResponse<User>>(Endpoints.USER_PROFILE);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(Config.STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
};

export default authService;
